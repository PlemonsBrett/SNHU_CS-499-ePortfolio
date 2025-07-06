import { FaRobot } from 'react-icons/fa';
import { useMultiLanguageRunnerState } from './functions';
import LanguageSelector from './children/LanguageSelector';
import ActionButtons from './children/ActionButtons';
import CodeEditor from './children/CodeEditor';
import OutputPanel from './children/OutputPanel';
import StatusInfo from './children/StatusInfo';
import type { MultiLanguageRunnerProps } from './props';

const MultiLanguageRunner = ({
	initialLanguage = 'javascript',
	initialCode,
	onCodeChange
}: MultiLanguageRunnerProps) => {
	const [state, handlers] = useMultiLanguageRunnerState(
		initialLanguage,
		initialCode,
		onCodeChange
	);

	return (
		<div className="w-full max-w-6xl mx-auto p-4 bg-gray-900 rounded-lg">
			<div className="mb-4 flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<FaRobot className="text-blue-400" />
					<h3 className="text-lg font-semibold text-white">AI/ML Code Runner</h3>
				</div>
				
				<LanguageSelector
					selectedLanguage={state.selectedLanguage}
					onLanguageChange={handlers.handleLanguageChange}
				/>

				<ActionButtons
					isRunning={state.isRunning}
					pyodideReady={state.pyodideReady}
					selectedLanguage={state.selectedLanguage}
					onExecuteCode={handlers.handleExecuteCode}
					onCopyCode={handlers.copyCode}
					onDownloadCode={handlers.downloadCode}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
				<CodeEditor
					selectedLanguage={state.selectedLanguage}
					code={state.code}
					onCodeChange={handlers.handleCodeChange}
				/>

				<OutputPanel
					selectedLanguage={state.selectedLanguage}
					output={state.output}
				/>
			</div>

			<StatusInfo selectedLanguage={state.selectedLanguage} />
		</div>
	);
};

export default MultiLanguageRunner;