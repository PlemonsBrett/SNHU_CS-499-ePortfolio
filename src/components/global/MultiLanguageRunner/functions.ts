import { useCallback, useEffect, useRef, useState } from 'react';
import { executeCode } from '../executors/index';
import { languages } from '../languages/index';
import type { MultiLanguageRunnerState } from './types';

export const useMultiLanguageRunnerState = (
	initialLanguage: string,
	initialCode?: string,
	onCodeChange?: (code: string) => void
): [MultiLanguageRunnerState, Record<string, unknown>, React.RefObject<unknown>] => {
	const [selectedLanguage, setSelectedLanguage] = useState(
		languages.find((l) => l.id === initialLanguage) ?? languages[0]
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

	const state: MultiLanguageRunnerState = {
		selectedLanguage,
		code,
		output,
		isRunning,
		pyodideReady,
	};

	const handlers = {
		handleLanguageChange,
		handleCodeChange,
		handleExecuteCode,
		copyCode,
		downloadCode,
	};

	return [state, handlers, pyodideRef];
};