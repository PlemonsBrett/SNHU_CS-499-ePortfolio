// WebAssembly Module Loader for Neural Speech Synthesis

export interface WasmModule {
  instance: WebAssembly.Instance;
  exports: Record<string, unknown>;
}

interface GoWasmInterface {
  Go: new () => {
    importObject: WebAssembly.Imports;
    run: (instance: WebAssembly.Instance) => void;
  };
}

interface GoExports extends Record<string, unknown> {
  // Add specific Go function signatures here if known
}

const modules: Map<string, WasmModule> = new Map();

export async function loadRustVocoder(): Promise<Record<string, unknown>> {
  const existingModule = modules.get('rust-vocoder');
  if (existingModule) {
    return existingModule.exports;
  }

  try {
    // Import wasm-pack generated module
    const wasmModule = await import('/wasm/neural-vocoder/neural_vocoder.js');
    await wasmModule.default();

    modules.set('rust-vocoder', {
      instance: wasmModule.instance,
      exports: wasmModule
    });

    return wasmModule;
  } catch (error) {
    console.error('Failed to load Rust Neural Vocoder WASM:', error);
    throw error;
  }
}

export async function loadGoAttention(): Promise<Record<string, unknown>> {
  const existingModule = modules.get('go-attention');
  if (existingModule) {
    return existingModule.exports;
  }

  try {
    // Load Go WASM module
    const go = new ((window as unknown) as GoWasmInterface).Go();
    const wasmBytes = await fetch('/wasm/attention-go/attention.wasm');
    const wasmArrayBuffer = await wasmBytes.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer, go.importObject);

    // Start Go runtime
    go.run(wasmModule.instance);

    modules.set('go-attention', {
      instance: wasmModule.instance,
      exports: (window as unknown) as GoExports // Go exports functions to global scope
    });

    return (window as unknown) as GoExports;
  } catch (error) {
    console.error('Failed to load Go Attention WASM:', error);
    throw error;
  }
}

export function isSupported(): boolean {
  return typeof WebAssembly === 'object' &&
    typeof WebAssembly.instantiate === 'function';
}