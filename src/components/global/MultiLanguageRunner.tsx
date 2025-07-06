// src/components/global/MultiLanguageRunner.tsx
import { Sandpack } from '@codesandbox/sandpack-react';
import MonacoEditor from '@monaco-editor/react';
import { FaPlay, FaStop, FaDownload, FaCopy, FaCode, FaRobot } from 'react-icons/fa';
import { useCallback, useEffect, useRef, useState } from 'react';
import { executeCode } from './executors/index';
import { languages } from './languages/index';
import type { MultiLanguageRunnerProps } from './MultiLanguageRunner/types';

export default function MultiLanguageRunner({
  initialLanguage = 'javascript',
  initialCode,
  onCodeChange
}: Readonly<MultiLanguageRunnerProps>) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((l: { id: string; }) => l.id === initialLanguage) ?? languages[0]
  );
  const [code, setCode] = useState(initialCode ?? selectedLanguage.defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef<unknown>(null);

  const loadPyodide = useCallback(async () => {
    try {
      setOutput('Loading Python environment with AI/ML libraries...');
      const pyodide = await (window as unknown as { loadPyodide: (options: { indexURL: string }) => Promise<unknown> }).loadPyodide({ 
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      
      // Load AI/ML packages for neural speech synthesis
      await (pyodide as { loadPackage: (packages: string[]) => Promise<void> }).loadPackage(['numpy', 'matplotlib', 'pandas', 'scipy']);
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      setOutput('Python environment ready with NumPy, Matplotlib, Pandas, SciPy! 🐍🧠');
    } catch (error) {
      setOutput(`Error loading Python environment: ${error}`);
    }
  }, []);

  // Initialize runtime based on language
  useEffect(() => {
    if (selectedLanguage.runtime === 'pyodide' && !pyodideReady) {
      loadPyodide();
    }
  }, [selectedLanguage.runtime, pyodideReady, loadPyodide]);

  const handleLanguageChange = (langId: string) => {
    const lang = languages.find((l: { id: string; }) => l.id === langId);
    if (lang) {
      setSelectedLanguage(lang);
      setCode(lang.defaultCode);
      setOutput('');
      onCodeChange?.(lang.defaultCode);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleExecuteCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      const result = await executeCode(
        selectedLanguage.runtime,
        code,
        pyodideRef.current,
        pyodideReady,
        selectedLanguage
      );
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural-${selectedLanguage.aiMlFocus.toLowerCase().replace(/\s+/g, '-')}.${selectedLanguage.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-900 rounded-lg">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FaRobot className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI/ML Code Runner</h3>
        </div>
        
        <select
          value={selectedLanguage.id}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name} - {lang.aiMlFocus}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExecuteCode}
            disabled={isRunning || (selectedLanguage.runtime === 'pyodide' && !pyodideReady)}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {isRunning ? <FaStop /> : <FaPlay />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button
            type="button"
            onClick={copyCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaCopy /> Copy
          </button>
          
          <button
            type="button"
            onClick={downloadCode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
        {/* Code Editor */}
        <div className="border border-gray-600 rounded">
          {selectedLanguage.runtime === 'sandpack' ? (
            <Sandpack
              template={selectedLanguage.id === 'typescript' ? 'react-ts' : 'vanilla'}
              files={{
                [`/src/index.${selectedLanguage.extension}`]: code,
              }}
              theme="dark"
              options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: true,
                editorHeight: 350,
              }}
            />
          ) : (
            <MonacoEditor
              height="350px"
              language={selectedLanguage.id === 'elixir' ? 'ruby' : selectedLanguage.id}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          )}
        </div>

        {/* Output Panel */}
        {selectedLanguage.runtime !== 'sandpack' && (
          <div className="bg-black text-green-400 p-4 rounded border border-gray-600 font-mono text-sm overflow-auto">
            <div className="mb-2 text-gray-400 flex items-center gap-2">
              <FaCode />
              Output - {selectedLanguage.name} ({selectedLanguage.aiMlFocus}):
            </div>
            <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to execute...'}</pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-2 mb-2">
          <FaRobot className="text-blue-400" />
          <strong>{selectedLanguage.name}</strong> - {selectedLanguage.aiMlFocus}
        </div>
        <div className="text-xs">
          {selectedLanguage.runtime === 'sandpack' && '🟢 Interactive JavaScript/TypeScript execution with live preview'}
          {selectedLanguage.runtime === 'pyodide' && '🐍 Python with NumPy, Matplotlib, Pandas for AI/ML processing'}
          {selectedLanguage.runtime === 'wasm' && '⚡ WebAssembly simulation - high-performance neural processing'}
          {selectedLanguage.runtime === 'beam' && '🎭 Elixir Actor model simulation - concurrent audio processing'}
          {selectedLanguage.runtime === 'jvm' && '🧮 Scala functional programming - type-safe ML pipelines'}
        </div>
      </div>
    </div>
  );
}