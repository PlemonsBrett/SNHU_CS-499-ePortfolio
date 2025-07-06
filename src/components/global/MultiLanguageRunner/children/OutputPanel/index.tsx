import { FaCode } from 'react-icons/fa';
import type { OutputPanelProps } from './props';

const OutputPanel = ({ selectedLanguage, output }: OutputPanelProps) => {
	if (selectedLanguage.runtime === 'sandpack') {
		return null;
	}

	return (
		<div className="bg-black text-green-400 p-4 rounded border border-gray-600 font-mono text-sm overflow-auto">
			<div className="mb-2 text-gray-400 flex items-center gap-2">
				<FaCode />
				Output - {selectedLanguage.name} ({selectedLanguage.aiMlFocus}):
			</div>
			<pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to execute...'}</pre>
		</div>
	);
};

export default OutputPanel;