/**
 * Web Worker wrapper for WASM modules
 * Provides a more reliable way to load and execute WASM modules
 */

export class WASMWorker {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingCalls = new Map<number, { resolve: Function; reject: Function }>();

  constructor(private wasmUrl: string, private jsUrl: string) {}

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create worker with WASM loading code
      const workerCode = `
        // Import the WASM module
        importScripts('${this.jsUrl}');
        
        let wasmModule = null;
        
        self.onmessage = async function(e) {
          const { id, type, data } = e.data;
          
          try {
            switch (type) {
              case 'init':
                // Initialize WASM module
                wasmModule = await self.default('${this.wasmUrl}');
                self.postMessage({ id, type: 'init', success: true });
                break;
                
              case 'call':
                // Call WASM function
                const result = wasmModule[data.function](...data.args);
                self.postMessage({ id, type: 'call', result });
                break;
                
              default:
                throw new Error('Unknown message type: ' + type);
            }
          } catch (error) {
            self.postMessage({ id, type: 'error', error: error.message });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));

      this.worker.onmessage = (e) => {
        const { id, type, success, result, error } = e.data;
        
        if (type === 'error') {
          const pending = this.pendingCalls.get(id);
          if (pending) {
            pending.reject(new Error(error));
            this.pendingCalls.delete(id);
          }
          return;
        }

        const pending = this.pendingCalls.get(id);
        if (pending) {
          if (type === 'init') {
            pending.resolve();
          } else {
            pending.resolve(result);
          }
          this.pendingCalls.delete(id);
        }
      };

      this.worker.onerror = (error) => {
        reject(new Error(`Worker error: ${error.message}`));
      };

      // Initialize the worker
      this.sendMessage('init', {}).then(resolve).catch(reject);
    });
  }

  private sendMessage(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      this.pendingCalls.set(id, { resolve, reject });
      
      if (this.worker) {
        this.worker.postMessage({ id, type, data });
      } else {
        reject(new Error('Worker not initialized'));
      }
    });
  }

  async callFunction(functionName: string, ...args: any[]): Promise<any> {
    return this.sendMessage('call', { function: functionName, args });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Factory function to create WASM workers
export async function createWASMWorker(moduleName: string): Promise<WASMWorker> {
  const jsUrl = `/wasm/${moduleName}/${moduleName}.js`;
  const wasmUrl = `/wasm/${moduleName}/${moduleName}_bg.wasm`;
  
  const worker = new WASMWorker(wasmUrl, jsUrl);
  await worker.init();
  return worker;
} 