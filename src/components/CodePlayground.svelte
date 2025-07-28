<script>
import { onMount } from 'svelte'

let code = ''
let output = []
let _running = false

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

function _runCode() {
  output = []
  _running = true

  // Override console.log to capture output
  const originalLog = console.log
  console.log = (...args) => {
    output = [
      ...output,
      args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' '),
    ]
  }

  try {
    // Create a new function from the code string and execute it
    const func = new Function(code)
    func()
  } catch (error) {
    output = [...output, `Error: ${error.message}`]
  } finally {
    // Restore original console.log
    console.log = originalLog
    _running = false
  }
}

function _clearOutput() {
  output = []
}
</script>

<div class="playground">
  <div class="code-slot" style="display: none;">
    <slot />
  </div>

  <div class="editor">
    <div class="toolbar">
      <button on:click={_runCode} disabled={_running}>
        {_running ? "Running..." : "Run Code"}
      </button>
      <button on:click={_clearOutput} disabled={output.length === 0}>
        Clear Output
      </button>
    </div>

    <textarea bind:value={code} class="code-input" spellcheck="false" rows="20"
    ></textarea>
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
