import { FaPlay, FaStop, FaDownload, FaCopy } from 'react-icons/fa';
import type { ActionButtonsProps } from './props';

const ActionButtons = ({ 
	isRunning, 
	pyodideReady, 
	selectedLanguage, 
	onExecuteCode, 
	onCopyCode, 
	onDownloadCode 
}: ActionButtonsProps) => {
	return (
		<div className="flex gap-2">
			<button
				type="button"
				onClick={onExecuteCode}
				disabled={isRunning || (selectedLanguage.runtime === 'pyodide' && !pyodideReady)}
				className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
			>
				{isRunning ? <FaStop /> : <FaPlay />}
				{isRunning ? 'Running...' : 'Run Code'}
			</button>
			
			<button
				type="button"
				onClick={onCopyCode}
				className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
			>
				<FaCopy /> Copy
			</button>
			
			<button
				type="button"
				onClick={onDownloadCode}
				className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
			>
				<FaDownload /> Download
			</button>
		</div>
	);
};

export default ActionButtons;