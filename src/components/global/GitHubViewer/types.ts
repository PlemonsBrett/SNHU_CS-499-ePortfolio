import type { userConfig } from "../../../config/userConfig";

export type Project = (typeof userConfig.projects)[number] & {
	executableCode?: {
		language: "javascript" | "typescript" | "python" | "rust" | "cpp" | "go";
		code: string;
		description: string;
	};
	demoFeatures?: string[];
};

export interface GitHubViewerState {
	selectedProject: Project | null;
	showStructure: boolean;
	showCodeRunner: boolean;
}

export interface GitHubViewerHandlers {
	handleProjectClick: (project: Project) => void;
	handleBackClick: () => void;
	handleRunCodeClick: () => void;
	handleCodeRunnerBack: () => void;
}