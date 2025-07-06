/**
 * WebAssembly Module Loader
 * Handles dynamic loading and initialization of WASM modules for the portfolio
 */

export interface WASMModule {
  instance: WebAssembly.Instance;
  exports: any;
  memory?: WebAssembly.Memory;
}

export interface WASMLoaderOptions {
  importObject?: WebAssembly.Imports;
  memorySize?: number;
  maxMemorySize?: number;
}

/**
 * Loads a WebAssembly module from a URL
 * @param url - URL to the WASM file
 * @param options - Loading options
 * @returns Promise resolving to the loaded WASM module
 */
export async function loadWASMModule(
  url: string, 
  options: WASMLoaderOptions = {}
): Promise<WASMModule> {
  try {
    console.log(`Loading WASM module from: ${url}`);
    
    // Fetch the WASM binary
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM module: ${response.statusText}`);
    }
    
    const wasmBuffer = await response.arrayBuffer();
    
    // Prepare import object with memory if specified
    const importObject: WebAssembly.Imports = {
      env: {
        ...(options.memorySize ? {
          memory: new WebAssembly.Memory({ 
            initial: options.memorySize,
            maximum: options.maxMemorySize || options.memorySize * 2
          })
        } : {})
      },
      ...options.importObject
    };
    
    // Instantiate the WASM module
    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    
    console.log(`WASM module loaded successfully: ${url}`);
    
    return {
      instance: result.instance,
      exports: result.instance.exports,
      memory: (importObject.env as any)?.memory
    };
  } catch (error) {
    console.error(`Error loading WASM module from ${url}:`, error);
    throw error;
  }
}

/**
 * Loads a Rust WASM module with wasm-bindgen support
 * @param baseUrl - Base URL for the WASM files
 * @param moduleName - Name of the module
 * @returns Promise resolving to the loaded module
 */
export async function loadRustWASMModule(
  baseUrl: string, 
  moduleName: string
): Promise<any> {
  try {
    console.log(`Loading Rust WASM module: ${moduleName}`);
    
    // Use the public/wasm path for runtime loading
    const jsUrl = `/wasm/${moduleName}/${moduleName}.js`;
    const wasmUrl = `/wasm/${moduleName}/${moduleName}_bg.wasm`;
    
    try {
      const module = await import(/* @vite-ignore */ jsUrl);
      await module.default(wasmUrl);
      console.log(`Rust WASM module loaded: ${moduleName}`);
      return module;
    } catch (importError) {
      console.warn('Direct import failed, trying alternative method:', importError);
      
      // Fallback: fetch and create blob
      const response = await fetch(jsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch WASM module: ${response.statusText}`);
      }
      
      const jsCode = await response.text();
      
      // Create a blob URL for the JavaScript code
      const blob = new Blob([jsCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Import the module using the blob URL
      const module = await import(/* @vite-ignore */ blobUrl);
      
      // Initialize the module with the WASM file
      await module.default(wasmUrl);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      console.log(`Rust WASM module loaded (fallback method): ${moduleName}`);
      return module;
    }
  } catch (error) {
    console.error(`Error loading Rust WASM module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Loads a Go WASM module
 * @param baseUrl - Base URL for the WASM files
 * @param moduleName - Name of the module
 * @returns Promise resolving to the loaded module
 */
export async function loadGoWASMModule(
  baseUrl: string, 
  moduleName: string
): Promise<any> {
  try {
    console.log(`Loading Go WASM module: ${moduleName}`);
    
    // Load the Go WASM JavaScript runtime
    const jsUrl = `${baseUrl}/wasm_exec.js`;
    const wasmUrl = `${baseUrl}/${moduleName}.wasm`;
    
    // Import the Go runtime
    await import(/* @vite-ignore */ jsUrl);
    
    // Load the WASM file
    const response = await fetch(wasmUrl);
    const wasmBuffer = await response.arrayBuffer();
    
    // Initialize Go runtime
    const go = new (window as any).Go();
    const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    
    // Run the Go program
    go.run(result.instance);
    
    console.log(`Go WASM module loaded: ${moduleName}`);
    return result.instance;
  } catch (error) {
    console.error(`Error loading Go WASM module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Preloads WASM modules for better performance
 * @param modules - Array of module configurations to preload
 */
export async function preloadWASMModules(modules: Array<{
  type: 'rust' | 'go';
  baseUrl: string;
  moduleName: string;
}>): Promise<void> {
  console.log('Preloading WASM modules...');
  
  const preloadPromises = modules.map(async ({ type, baseUrl, moduleName }) => {
    try {
      if (type === 'rust') {
        await loadRustWASMModule(baseUrl, moduleName);
      } else if (type === 'go') {
        await loadGoWASMModule(baseUrl, moduleName);
      }
    } catch (error) {
      console.warn(`Failed to preload ${type} module ${moduleName}:`, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
  console.log('WASM module preloading complete');
}

/**
 * Checks if WebAssembly is supported in the current environment
 * @returns boolean indicating WASM support
 */
export function isWASMSupported(): boolean {
  return typeof WebAssembly !== 'undefined' && 
         typeof WebAssembly.instantiate === 'function';
}

/**
 * Gets WASM support information for debugging
 * @returns Object with WASM support details
 */
export function getWASMSupportInfo(): {
  supported: boolean;
  features: string[];
  errors: string[];
} {
  const info = {
    supported: true,
    features: [] as string[],
    errors: [] as string[]
  };
  
  try {
    if (typeof WebAssembly === 'undefined') {
      info.supported = false;
      info.errors.push('WebAssembly is not defined');
      return info;
    }
    
    if (typeof WebAssembly.instantiate !== 'function') {
      info.supported = false;
      info.errors.push('WebAssembly.instantiate is not available');
      return info;
    }
    
    // Check for additional features
    if (typeof WebAssembly.Memory === 'function') {
      info.features.push('Memory API');
    }
    
    if (typeof WebAssembly.Table === 'function') {
      info.features.push('Table API');
    }
    
    if (typeof WebAssembly.Global === 'function') {
      info.features.push('Global API');
    }
    
    // Check for SIMD support
    if (typeof WebAssembly.validate === 'function') {
      info.features.push('Validation API');
    }
    
  } catch (error) {
    info.supported = false;
    info.errors.push(`Error checking WASM support: ${error}`);
  }
  
  return info;
}