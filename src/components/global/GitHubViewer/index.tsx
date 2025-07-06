import { userConfig } from "../../../config/userConfig";
import DraggableWindow from "../DraggableWindow";
import ProjectList from "./children/ProjectList";
import ProjectDetail from "./children/ProjectDetail";
import CodeRunner from "./children/CodeRunner";
import { useGitHubViewerState } from "./functions";
import type { GitHubViewerProps } from "./props";
import type { Project } from "./types";

const GitHubViewer = ({ isOpen, onClose }: GitHubViewerProps) => {
	const [state, handlers] = useGitHubViewerState();

	if (!isOpen) return null;

	return (
		<DraggableWindow
			title={
				state.showStructure && state.selectedProject?.title
					? state.selectedProject.title
					: "GitHub Projects"
			}
			onClose={onClose}
			initialPosition={{
				x: Math.floor(window.innerWidth * 0.1),
				y: Math.floor(window.innerHeight * 0.1),
			}}
			className="w-[95vw] md:max-w-6xl max-h-[95vh] flex flex-col"
			initialSize={{ width: 1000, height: 700 }}
		>
			<div className="flex flex-col flex-grow min-h-0 h-full">
				<div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6">
					{!state.showStructure && (
						<ProjectList
							projects={[...userConfig.projects] as Project[]}
							onProjectClick={handlers.handleProjectClick}
						/>
					)}

					{state.showCodeRunner && state.selectedProject?.executableCode && (
						<CodeRunner
							projectTitle={state.selectedProject.title}
							executableCode={state.selectedProject.executableCode}
							onBack={handlers.handleCodeRunnerBack}
						/>
					)}

					{state.showStructure &&
						!state.showCodeRunner &&
						state.selectedProject && (
							<ProjectDetail
								project={state.selectedProject}
								onBack={handlers.handleBackClick}
								onRunCode={handlers.handleRunCodeClick}
							/>
						)}
				</div>
			</div>
		</DraggableWindow>
	);
};

export default GitHubViewer;
export type { Project } from "./types";
