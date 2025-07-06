import { FaRobot } from 'react-icons/fa';
import type { StatusInfoProps } from './props';

const StatusInfo = ({ selectedLanguage }: StatusInfoProps) => {
	return (
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
	);
};

export default StatusInfo;