import type { Project } from "../../types";

export interface ProjectDetailProps {
	project: Project;
	onBack: () => void;
	onRunCode: () => void;
}