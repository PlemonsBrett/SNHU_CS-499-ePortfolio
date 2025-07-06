export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'rust' | 'cpp' | 'go' | 'elixir' | 'scala';

export type Runtime = 'sandpack' | 'pyodide' | 'wasm' | 'beam' | 'jvm';

export interface Language {
	id: string;
	name: string;
	extension: string;
	runtime: Runtime;
	aiMlFocus: string;
	defaultCode: string;
}

export interface MultiLanguageRunnerProps {
	initialLanguage?: 'javascript' | 'typescript' | 'python' | 'rust' | 'cpp' | 'go' | 'elixir' | 'scala';
	initialCode?: string;
	onCodeChange?: (code: string) => void;
}

export interface MultiLanguageRunnerState {
	selectedLanguage: Language;
	code: string;
	output: string;
	isRunning: boolean;
	pyodideReady: boolean;
}