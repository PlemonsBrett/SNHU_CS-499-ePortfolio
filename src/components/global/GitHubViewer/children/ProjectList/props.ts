import type { Project } from "../../types";

export interface ProjectListProps {
	projects: Project[];
	onProjectClick: (project: Project) => void;
}