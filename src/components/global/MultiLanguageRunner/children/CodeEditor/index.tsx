import { Sandpack } from '@codesandbox/sandpack-react';
import MonacoEditor from '@monaco-editor/react';
import type { CodeEditorProps } from './props';

const CodeEditor = ({ selectedLanguage, code, onCodeChange }: CodeEditorProps) => {
	return (
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
					onChange={onCodeChange}
					options={{
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						fontSize: 14,
						wordWrap: 'on',
					}}
				/>
			)}
		</div>
	);
};

export default CodeEditor;