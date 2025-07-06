import { FaExternalLinkAlt, FaGithub, FaPlay } from "react-icons/fa";
import type { ProjectCardProps } from "./props";

const ProjectCard = ({ project, onProjectClick }: ProjectCardProps) => {
	return (
		<button
			className="bg-gray-800/50 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 w-full text-left"
			onClick={() => onProjectClick(project)}
			type="button"
		>
			{project.images && project.images.length > 0 && (
				<div className="w-full h-48 mb-3 overflow-hidden rounded-lg">
					<img
						src={project.images[0].url}
						alt={project.images[0].alt}
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<h3 className="text-xl font-semibold mb-2 text-gray-200">
				{project.title}
			</h3>
			<p className="text-gray-400 mb-2">{project.description}</p>

			{project.demoFeatures && (
				<div className="mb-3">
					<div className="text-sm text-green-400 mb-1">
						✨ Interactive Features:
					</div>
					<div className="flex flex-wrap gap-1">
						{project.demoFeatures.map((feature: string, i: number) => (
							<span
								key={`feature-${i}-${feature}`}
								className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs"
							>
								{feature}
							</span>
						))}
					</div>
				</div>
			)}

			<div className="flex flex-wrap gap-2 mb-2">
				{project.techStack.map((tech: string) => (
					<span
						key={tech}
						className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
					>
						{tech}
					</span>
				))}
			</div>

			{project.executableCode && (
				<div className="mb-2">
					<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
						<FaPlay size={10} />
						Interactive {project.executableCode.language} Demo
					</span>
				</div>
			)}

			<div className="flex gap-4">
				<a
					href={project.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300"
					onClick={(e) => e.stopPropagation()}
				>
					<FaGithub />
					<span>Repository</span>
				</a>
				{project.liveUrl && (
					<a
						href={project.liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300"
						onClick={(e) => e.stopPropagation()}
					>
						<FaExternalLinkAlt />
						<span>Live Demo</span>
					</a>
				)}
			</div>
		</button>
	);
};

export default ProjectCard;