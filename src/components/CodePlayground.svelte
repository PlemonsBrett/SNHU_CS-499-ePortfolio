<script>
import { onMount } from 'svelte'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

let code = $state('')
let output = $state([])
let running = $state(false)
let error = $state(false)
let iframe = null
let codeElement = null

const { children, title = '', description = '' } = $props()

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

// AST node types that are considered dangerous
const DANGEROUS_NODE_TYPES = new Set([
  'ImportDeclaration',
  'ImportExpression',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
  'WithStatement',
  'MetaProperty',
  'ImportNamespaceSpecifier',
  'ImportDefaultSpecifier',
  'ImportSpecifier'
])

// Function to perform AST-based security validation
function validateAST(codeStr) {
  try {
    // Parse the code into an AST
    const ast = acorn.parse(codeStr, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowReturnOutsideFunction: false,
      allowImportExportEverywhere: false,
      allowAwaitOutsideFunction: false
    })

    let violations = []

    // Walk the AST and check for dangerous constructs
    walk.simple(ast, {
      // Check for dangerous node types
      enter(node) {
        if (DANGEROUS_NODE_TYPES.has(node.type)) {
          violations.push(`Dangerous construct: ${node.type}`)
        }
      },
      
      // Check for eval and Function constructor
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'eval') {
          violations.push('Direct eval() usage is not allowed')
        }
      },
      
      // Check for new Function()
      NewExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Function') {
          violations.push('Function constructor is not allowed')
        }
      },
      
      // Check for accessing dangerous properties
      MemberExpression(node) {
        const objName = node.object.type === 'Identifier' ? node.object.name : null
        const propName = node.property.type === 'Identifier' ? node.property.name : 
                        node.property.type === 'Literal' ? node.property.value : null

        // Check for dangerous objects
        if (objName && ['window', 'global', 'globalThis', 'document', 'process'].includes(objName)) {
          violations.push(`Access to ${objName} is not allowed`)
        }

        // Check for __proto__ and constructor manipulation
        if (propName === '__proto__' || propName === 'constructor') {
          violations.push(`Access to ${propName} property is potentially dangerous`)
        }

        // Check for accessing Function through constructor
        if (propName === 'constructor' && node.object.type === 'MemberExpression') {
          violations.push('Indirect access to Function constructor is not allowed')
        }
      },
      
      // Check for accessing global variables that aren't whitelisted
      Identifier(node, state, ancestors) {
        // Skip if it's a property name or function parameter
        const parent = ancestors[ancestors.length - 2]
        if (parent && (
          (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) ||
          (parent.type === 'Property' && parent.key === node) ||
          (parent.type === 'FunctionExpression' && parent.params.includes(node)) ||
          (parent.type === 'FunctionDeclaration' && parent.params.includes(node)) ||
          (parent.type === 'ArrowFunctionExpression' && parent.params.includes(node)) ||
          (parent.type === 'VariableDeclarator' && parent.id === node)
        )) {
          return
        }

        // Check if it's trying to access a non-whitelisted global
        if (node.name && !ALLOWED_GLOBALS.includes(node.name) && 
            ['window', 'global', 'globalThis', 'document', 'process', 'require', 'module', 'exports', '__dirname', '__filename'].includes(node.name)) {
          violations.push(`Access to global '${node.name}' is not allowed`)
        }
      }
    })

    if (violations.length > 0) {
      return {
        valid: false,
        error: `Security Error (AST): ${violations.join('; ')}`
      }
    }

    return { valid: true }
  } catch (e) {
    return {
      valid: false,
      error: `Parse Error: ${e.message}`
    }
  }
}

onMount(() => {
  // Extract code from slot content
  const slot = document.querySelector('.code-slot')
  if (slot) {
    const codeBlock = slot.querySelector('pre code')
    if (codeBlock) {
      code = codeBlock.textContent.trim()
      // Apply syntax highlighting to the displayed code
      if (codeElement) {
        codeElement.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript')
      }
    }
  }
})

// Update syntax highlighting when code changes
$effect(() => {
  if (codeElement && code) {
    codeElement.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript')
  }
})

function validateCode(codeStr) {
  // First, check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(codeStr)) {
      return {
        valid: false,
        error: `Security Error: Potentially dangerous code pattern detected: ${pattern.toString()}`
      }
    }
  }
  
  // Second, perform AST-based validation
  const astValidation = validateAST(codeStr)
  if (!astValidation.valid) {
    return astValidation
  }
  
  // Finally, basic syntax check
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
  error = false

  // Validate code before execution
  const validation = validateCode(code)
  if (!validation.valid) {
    output = [validation.error]
    error = true
    running = false
    return
  }

  // Create a sandboxed iframe for code execution
  if (iframe) {
    iframe.remove()
  }

  iframe = document.createElement('iframe')
  iframe.style.display = 'none'
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
        with (restrictedGlobal) {
          ${code}
        }
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
        error = true
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
      error = true
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
  error = false
}

function copyCode() {
  navigator.clipboard.writeText(code)
  // Show feedback (you could add a toast notification here)
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

  {#if title || description}
    <div class="playground-header">
      {#if title}
        <h3 class="playground-title">{title}</h3>
      {/if}
      {#if description}
        <p class="playground-description">{description}</p>
      {/if}
    </div>
  {/if}

  <div class="editor-container">
    <div class="editor-header">
      <div class="editor-tabs">
        <div class="editor-tab active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          JavaScript
        </div>
      </div>
      <div class="editor-actions">
        <button onclick={copyCode} class="icon-button" title="Copy code">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="editor">
      <div class="line-numbers">
        {#each code.split('\n') as _, i}
          <div class="line-number">{i + 1}</div>
        {/each}
      </div>
      <div class="code-wrapper">
        <textarea 
          bind:value={code} 
          class="code-input" 
          spellcheck="false"
          placeholder="Write your JavaScript code here..."
        ></textarea>
        <pre class="code-highlight"><code bind:this={codeElement} class="language-javascript"></code></pre>
      </div>
    </div>
    
    <div class="toolbar">
      <button onclick={runCode} disabled={running} class="run-button">
        {#if running}
          <span class="spinner"></span>
          Running...
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Run Code
        {/if}
      </button>
      <button onclick={clearOutput} disabled={output.length === 0} class="clear-button">
        Clear Output
      </button>
    </div>
  </div>

  {#if output.length > 0}
    <div class="output-container" class:error>
      <div class="output-header">
        <h4>Output</h4>
        <span class="output-count">{output.length} line{output.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="output">
        {#each output as line}
          <div class="output-line">{line}</div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .playground {
    margin: 2rem 0;
    background: #1e1e1e;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 100%;
  }

  .playground-header {
    padding: 1.5rem;
    background: #252526;
    border-bottom: 1px solid #3e3e42;
  }

  .playground-title {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #e1e1e1;
  }

  .playground-description {
    margin: 0;
    font-size: 0.875rem;
    color: #8b8b8d;
    line-height: 1.5;
  }

  .editor-container {
    background: #1e1e1e;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2d2d30;
    border-bottom: 1px solid #3e3e42;
    padding: 0;
  }

  .editor-tabs {
    display: flex;
  }

  .editor-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #1e1e1e;
    color: #cccccc;
    font-size: 0.875rem;
    font-weight: 500;
    border-bottom: 2px solid transparent;
  }

  .editor-tab.active {
    color: #ffffff;
    border-bottom-color: #007acc;
  }

  .editor-tab svg {
    color: #f7df1e;
  }

  .editor-actions {
    padding: 0 1rem;
  }

  .icon-button {
    background: none;
    border: none;
    color: #8b8b8d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  .icon-button:hover {
    background: #3e3e42;
    color: #e1e1e1;
  }

  .editor {
    display: flex;
    position: relative;
    min-height: 200px;
    max-height: 500px;
    overflow: auto;
  }

  .line-numbers {
    padding: 1rem 0;
    background: #1e1e1e;
    color: #6e7681;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    text-align: right;
    user-select: none;
    min-width: 3rem;
  }

  .line-number {
    padding: 0 1rem;
    height: 1.5rem;
  }

  .code-wrapper {
    flex: 1;
    position: relative;
  }

  .code-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: transparent;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    caret-color: #e1e1e1;
    z-index: 2;
    box-sizing: border-box;
  }

  .code-highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem;
    margin: 0;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;
  }

  .code-highlight code {
    color: #d4d4d4;
  }

  .toolbar {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #252526;
    border-top: 1px solid #3e3e42;
  }

  .run-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #0e639c;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .run-button:hover:not(:disabled) {
    background: #1177bb;
  }

  .run-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .clear-button {
    padding: 0.5rem 1rem;
    background: #3e3e42;
    color: #cccccc;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .clear-button:hover:not(:disabled) {
    background: #4e4e52;
  }

  .clear-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .output-container {
    background: #252526;
    border-top: 1px solid #3e3e42;
  }

  .output-container.error {
    background: #3a1d1d;
  }

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #3e3e42;
  }

  .output-header h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #e1e1e1;
  }

  .output-count {
    font-size: 0.75rem;
    color: #8b8b8d;
  }

  .output {
    padding: 1rem;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #d4d4d4;
    max-height: 300px;
    overflow-y: auto;
  }

  .output-line {
    margin-bottom: 0.25rem;
  }

  .output-line:last-child {
    margin-bottom: 0;
  }

  .error .output {
    color: #f48771;
  }

  /* Custom scrollbar */
  .editor::-webkit-scrollbar,
  .output::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  .editor::-webkit-scrollbar-track,
  .output::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  .editor::-webkit-scrollbar-thumb,
  .output::-webkit-scrollbar-thumb {
    background: #424242;
    border-radius: 6px;
  }

  .editor::-webkit-scrollbar-thumb:hover,
  .output::-webkit-scrollbar-thumb:hover {
    background: #4e4e4e;
  }

  @media (max-width: 768px) {
    .playground-header {
      padding: 1.25rem;
    }

    .editor {
      max-height: 400px;
    }

    .line-numbers {
      min-width: 2.5rem;
    }

    .line-number {
      padding: 0 0.75rem;
    }

    .code-input,
    .code-highlight {
      padding: 1rem 0.75rem;
    }
  }
</style>