import { FaChevronLeft } from "react-icons/fa";
import MultiLanguageRunner from "../../../MultiLanguageRunner";
import type { CodeRunnerProps } from "./props";

const CodeRunner = ({ projectTitle, executableCode, onBack }: CodeRunnerProps) => {
	return (
		<div>
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
			>
				<FaChevronLeft />
				<span>Back to Project Details</span>
			</button>

			<h3 className="text-2xl font-bold mb-4 text-gray-200">
				Interactive Demo: {projectTitle}
			</h3>

			<div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
				<p className="text-gray-300">{executableCode.description}</p>
			</div>

			<MultiLanguageRunner
				initialLanguage={executableCode.language}
				initialCode={executableCode.code}
			/>
		</div>
	);
};

export default CodeRunner;