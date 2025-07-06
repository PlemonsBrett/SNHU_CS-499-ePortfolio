import ProjectCard from "./children/ProjectCard";
import type { ProjectListProps } from "./props";

const ProjectList = ({ projects, onProjectClick }: ProjectListProps) => {
	return (
		<>
			<h2 className="text-2xl font-bold mb-4 text-gray-200">My Projects</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{projects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onProjectClick={onProjectClick}
					/>
				))}
			</div>
		</>
	);
};

export default ProjectList;