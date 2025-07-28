<script>
import { onMount } from 'svelte'

let code = $state('')
let output = $state([])
let running = $state(false)
let iframe = null

const { children } = $props()

// Whitelist of allowed global objects/functions for sandboxed code
const ALLOWED_GLOBALS = [
  'console', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 
  'Boolean', 'RegExp', 'JSON', 'parseInt', 'parseFloat', 'isNaN', 
  'isFinite', 'encodeURI', 'decodeURI', 'encodeURIComponent', 
  'decodeURIComponent'
]

// Patterns that indicate potentially dangerous code
const DANGEROUS_PATTERNS = [
  /eval\s*\(/,
  /new\s+Function/,
  /document\./,
  /window\./,
  /global\./,
  /process\./,
  /require\s*\(/,
  /import\s+/,
  /export\s+/,
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /\.innerHTML/,
  /\.outerHTML/,
  /addEventListener/,
  /setTimeout/,
  /setInterval/,
  /setImmediate/,
  /__proto__/,
  /constructor\s*\[/,
  /\[\s*['"`]constructor['"`]\s*\]/
]

onMount(() => {
  // Extract code from slot content
  const slot = document.querySelector('.code-slot')
  if (slot) {
    const codeBlock = slot.querySelector('pre code')
    if (codeBlock) {
      code = codeBlock.textContent.trim()
    }
  }
})

function validateCode(codeStr) {
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(codeStr)) {
      return {
        valid: false,
        error: `Security Error: Potentially dangerous code pattern detected: ${pattern.toString()}`
      }
    }
  }
  
  // Basic syntax check
  try {
    new Function(codeStr) // Only for syntax validation, not executed
    return { valid: true }
  } catch (e) {
    return {
      valid: false,
      error: `Syntax Error: ${e.message}`
    }
  }
}

function runCode() {
  output = []
  running = true

  // Validate code before execution
  const validation = validateCode(code)
  if (!validation.valid) {
    output = [validation.error]
    running = false
    return
  }

  // Create a sandboxed iframe for code execution
  if (iframe) {
    iframe.remove()
  }

  iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  // Even more restrictive sandbox
  iframe.sandbox = 'allow-scripts'
  iframe.setAttribute('csp', "default-src 'none'; script-src 'unsafe-inline'")
  document.body.appendChild(iframe)

  const sandboxCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline';">
    </head>
    <body>
    <script>
      // Create a restricted global scope
      const restrictedGlobal = {
        console: {
          log: (...args) => {
            const message = args
              .map(arg => {
                if (typeof arg === 'object') {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch (e) {
                    return String(arg);
                  }
                }
                return String(arg);
              })
              .join(' ');
            parent.postMessage({ type: 'log', message }, '*');
          }
        },
        Math: Math,
        Date: Date,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Boolean: Boolean,
        RegExp: RegExp,
        JSON: JSON,
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: isNaN,
        isFinite: isFinite,
        encodeURI: encodeURI,
        decodeURI: decodeURI,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent
      };

      // Override global error handler
      window.onerror = (message, source, lineno, colno, error) => {
        parent.postMessage({ 
          type: 'error', 
          message: error ? error.message : message 
        }, '*');
        return true;
      };

      // Execute user code in restricted context
      try {
        // Wrap code in a function with restricted scope
        const wrappedCode = \`
          (function(console, Math, Date, Array, Object, String, Number, Boolean, RegExp, JSON, parseInt, parseFloat, isNaN, isFinite, encodeURI, decodeURI, encodeURIComponent, decodeURIComponent) {
            "use strict";
            ${code.replace(/`/g, '\\`')}
          }).call(
            {}, 
            restrictedGlobal.console,
            restrictedGlobal.Math,
            restrictedGlobal.Date,
            restrictedGlobal.Array,
            restrictedGlobal.Object,
            restrictedGlobal.String,
            restrictedGlobal.Number,
            restrictedGlobal.Boolean,
            restrictedGlobal.RegExp,
            restrictedGlobal.JSON,
            restrictedGlobal.parseInt,
            restrictedGlobal.parseFloat,
            restrictedGlobal.isNaN,
            restrictedGlobal.isFinite,
            restrictedGlobal.encodeURI,
            restrictedGlobal.decodeURI,
            restrictedGlobal.encodeURIComponent,
            restrictedGlobal.decodeURIComponent
          );
        \`;
        
        eval(wrappedCode);
        parent.postMessage({ type: 'done' }, '*');
      } catch (error) {
        parent.postMessage({ 
          type: 'error', 
          message: error.message 
        }, '*');
      }
    <\/script>
    </body>
    </html>
  `

  // Set up message listener
  const messageHandler = (event) => {
    if (event.source !== iframe.contentWindow) return

    switch (event.data.type) {
      case 'log':
        output = [...output, event.data.message]
        break
      case 'error':
        output = [...output, `Error: ${event.data.message}`]
        running = false
        window.removeEventListener('message', messageHandler)
        if (iframe) {
          iframe.remove()
          iframe = null
        }
        break
      case 'done':
        running = false
        window.removeEventListener('message', messageHandler)
        if (iframe) {
          iframe.remove()
          iframe = null
        }
        break
    }
  }

  window.addEventListener('message', messageHandler)

  // Write sandboxed code to iframe
  iframe.srcdoc = sandboxCode

  // Timeout after 5 seconds to prevent infinite loops
  setTimeout(() => {
    if (running) {
      output = [...output, 'Error: Code execution timeout (5 seconds)']
      running = false
      window.removeEventListener('message', messageHandler)
      if (iframe) {
        iframe.remove()
        iframe = null
      }
    }
  }, 5000)
}

function clearOutput() {
  output = []
}

// Clean up on unmount
$effect(() => {
  return () => {
    if (iframe) {
      iframe.remove()
    }
  }
})
</script>

<div class="playground">
  <div class="code-slot" style="display: none;">
    {@render children?.()}
  </div>

  <div class="editor">
    <div class="toolbar">
      <button onclick={runCode} disabled={running}>
        {running ? "Running..." : "Run Code"}
      </button>
      <button onclick={clearOutput} disabled={output.length === 0}>
        Clear Output
      </button>
    </div>

    <textarea bind:value={code} class="code-input" spellcheck="false" rows="20"
    ></textarea>
    
    <div class="security-notice">
      ⚠️ This playground runs code in a restricted sandbox. Access to browser APIs, network requests, and DOM manipulation is disabled for security.
    </div>
  </div>

  {#if output.length > 0}
    <div class="output">
      <h4>Output:</h4>
      <pre>{output.join("\n")}</pre>
    </div>
  {/if}
</div>

<style>
  .playground {
    margin: 2rem 0;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .toolbar {
    background: #f9fafb;
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: #6366f1;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover:not(:disabled) {
    background: #4f46e5;
  }

  button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  button:last-child {
    background: #ef4444;
  }

  button:last-child:hover:not(:disabled) {
    background: #dc2626;
  }

  .code-input {
    width: 100%;
    padding: 1rem;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    border: none;
    resize: vertical;
    background: #1e293b;
    color: #e2e8f0;
  }

  .code-input:focus {
    outline: none;
  }

  .security-notice {
    padding: 0.75rem 1rem;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.75rem;
    border-top: 1px solid #fbbf24;
  }

  .output {
    background: #f9fafb;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .output h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .output pre {
    margin: 0;
    padding: 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    color: #111827;
    overflow-x: auto;
  }
</style>