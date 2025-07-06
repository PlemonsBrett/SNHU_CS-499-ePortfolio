import type { Project } from "../../../../types";

export interface ProjectCardProps {
	project: Project;
	onProjectClick: (project: Project) => void;
}