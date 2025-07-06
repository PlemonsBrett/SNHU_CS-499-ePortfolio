import { FaChevronLeft, FaGithub, FaLink, FaPlay } from "react-icons/fa";
import FileTree from "./children/FileTree";
import ImageGallery from "./children/ImageGallery";
import type { ProjectDetailProps } from "./props";

const ProjectDetail = ({ project, onBack, onRunCode }: ProjectDetailProps) => {
	return (
		<div>
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
			>
				<FaChevronLeft />
				<span>Back to Projects</span>
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Project Structure */}
				{project.structure && <FileTree structure={project.structure as any} />}

				{/* Screenshots and Details */}
				<div className="bg-gray-800/50 rounded-lg p-4">
					<h3 className="text-xl font-semibold mb-4 text-gray-200">
						Project Details
					</h3>

					{/* Interactive Code Demo Button */}
					{project.executableCode && (
						<div className="mb-4">
							<button
								type="button"
								onClick={onRunCode}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
							>
								<FaPlay />
								Run Interactive {project.executableCode.language} Demo
							</button>
							<p className="text-sm text-gray-400 mt-2 text-center">
								{project.executableCode.description}
							</p>
						</div>
					)}

					{/* Screenshots */}
					{project.images && <ImageGallery images={project.images} />}

					{/* Demo Features */}
					{project.demoFeatures && (
						<div className="mb-4">
							<h4 className="text-lg font-semibold mb-2 text-gray-200">
								Interactive Features
							</h4>
							<div className="space-y-2">
								{project.demoFeatures.map((feature: string, index: number) => (
									<div
										key={`demo-feature-${index}-${feature}`}
										className="flex items-center gap-2 text-gray-300"
									>
										<div className="w-2 h-2 bg-green-400 rounded-full"></div>
										<span>{feature}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Links */}
					<div className="space-y-2">
						{project.repoUrl && (
							<a
								href={project.repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300 bg-gray-700/50 p-3 rounded-lg transition-colors"
							>
								<FaGithub />
								<span>View Source Code</span>
							</a>
						)}
						{project.liveUrl && (
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300 bg-gray-700/50 p-3 rounded-lg transition-colors"
							>
								<FaLink />
								<span>Visit Live Application</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectDetail;