import { useState } from "react";
import type { Project, GitHubViewerState, GitHubViewerHandlers } from "./types";

export const useGitHubViewerState = (): [GitHubViewerState, GitHubViewerHandlers] => {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [showStructure, setShowStructure] = useState(false);
	const [showCodeRunner, setShowCodeRunner] = useState(false);

	const handleProjectClick = (project: Project) => {
		setSelectedProject(project);
		setShowStructure(true);
		setShowCodeRunner(false);
	};

	const handleBackClick = () => {
		setShowStructure(false);
		setShowCodeRunner(false);
		setSelectedProject(null);
	};

	const handleRunCodeClick = () => {
		setShowCodeRunner(true);
	};

	const handleCodeRunnerBack = () => {
		setShowCodeRunner(false);
	};

	return [
		{
			selectedProject,
			showStructure,
			showCodeRunner,
		},
		{
			handleProjectClick,
			handleBackClick,
			handleRunCodeClick,
			handleCodeRunnerBack,
		},
	];
};