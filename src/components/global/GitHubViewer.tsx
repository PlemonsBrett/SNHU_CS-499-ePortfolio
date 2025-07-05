import { useState } from "react";
import {
	FaChevronLeft,
	FaExternalLinkAlt,
	FaFile,
	FaFolder,
	FaGithub,
	FaLink,
	FaPlay,
} from "react-icons/fa";
import { userConfig } from "../../config/userConfig";
import DraggableWindow from "./DraggableWindow";
import MultiLanguageRunner from "./MultiLanguageRunner";

type FileNode = {
	name: string;
	type: "file" | "directory";
	children?: readonly FileNode[];
};

type ProjectStructure = {
	root: string;
	children: readonly FileNode[];
};

// Enhanced project type with executable code
type Project = (typeof userConfig.projects)[0] & {
	executableCode?: {
		language: "javascript" | "typescript" | "python" | "rust" | "cpp" | "go";
		code: string;
		description: string;
	};
	demoFeatures?: string[];
};

interface GitHubViewerProps {
	isOpen: boolean;
	onClose: () => void;
}

const GitHubViewer = ({ isOpen, onClose }: GitHubViewerProps) => {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
	const [showStructure, setShowStructure] = useState(false);
	const [showCodeRunner, setShowCodeRunner] = useState(false);
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const toggleNode = (path: string) => {
		const newExpandedNodes = new Set(expandedNodes);
		if (newExpandedNodes.has(path)) {
			newExpandedNodes.delete(path);
		} else {
			newExpandedNodes.add(path);
		}
		setExpandedNodes(newExpandedNodes);
	};

	const renderFileTree = (node: FileNode, path: string = "") => {
		const currentPath = path ? `${path}/${node.name}` : node.name;
		const isExpanded = expandedNodes.has(currentPath);

		return (
			<div key={currentPath} className="ml-4">
				{node.type === "directory" ? (
					<button
						type="button"
						className="flex items-center cursor-pointer hover:bg-gray-700/50 p-1 rounded w-full text-left"
						onClick={() => toggleNode(currentPath)}
						aria-expanded={isExpanded}
					>
						<FaFolder className="text-yellow-500 mr-2" />
						<span className="text-gray-200">{node.name}</span>
					</button>
				) : (
					<div className="flex items-center p-1 rounded">
						<FaFile className="text-blue-400 mr-2" />
						<span className="text-gray-200">{node.name}</span>
					</div>
				)}
				{node.type === "directory" && isExpanded && node.children && (
					<div className="ml-4">
						{node.children.map((child) => renderFileTree(child, currentPath))}
					</div>
				)}
			</div>
		);
	};

	const renderProjectStructure = (projectStructure: ProjectStructure) => {
		return (
			<div>
				<div className="flex items-center p-1 rounded">
					<FaFolder className="text-yellow-500 mr-2" />
					<span className="text-gray-200 font-bold">
						{projectStructure.root}
					</span>
				</div>
				<div className="ml-4">
					{projectStructure.children.map((child) =>
						renderFileTree(child, projectStructure.root),
					)}
				</div>
			</div>
		);
	};

	const handleProjectClick = (project: Project) => {
		setSelectedProject(project);
		setShowStructure(true);
		setShowCodeRunner(false);
		setActiveImageIndex(0);
	};

	const handleBackClick = () => {
		setShowStructure(false);
		setShowCodeRunner(false);
		setSelectedProject(null);
	};

	const handleRunCodeClick = () => {
		setShowCodeRunner(true);
	};

	const handleNextImage = () => {
		if (selectedProject) {
			setActiveImageIndex((prevIndex) =>
				prevIndex + 1 >= selectedProject.images.length ? 0 : prevIndex + 1,
			);
		}
	};

	const handlePrevImage = () => {
		if (selectedProject) {
			setActiveImageIndex((prevIndex) =>
				prevIndex - 1 < 0 ? selectedProject.images.length - 1 : prevIndex - 1,
			);
		}
	};

	if (!isOpen) return null;

	return (
		<DraggableWindow
			title={
				showStructure && selectedProject?.title
					? selectedProject.title
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
					{(() => {
						if (!showStructure) {
							return (
								<>
									<h2 className="text-2xl font-bold mb-4 text-gray-200">
										My Projects
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{userConfig.projects.map((project) => (
											<button
												key={project.id}
												className="bg-gray-800/50 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 w-full text-left"
												onClick={() => handleProjectClick(project as Project)}
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
												<p className="text-gray-400 mb-2">
													{project.description}
												</p>

												{/* Demo Features */}
												{(project as Project).demoFeatures && (
													<div className="mb-3">
														<div className="text-sm text-green-400 mb-1">
															✨ Interactive Features:
														</div>
														<div className="flex flex-wrap gap-1">
															{(project as Project).demoFeatures?.map(
																(feature: string, i: number) => (
																	<span
																		key={`feature-${i}-${feature}`}
																		className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs"
																	>
																		{feature}
																	</span>
																),
															)}
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

												{/* Executable Code Indicator */}
												{(project as Project).executableCode && (
													<div className="mb-2">
														<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
															<FaPlay size={10} />
															Interactive{" "}
															{(project as Project).executableCode?.language}{" "}
															Demo
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
										))}
									</div>
								</>
							);
						}

						if (showCodeRunner && selectedProject?.executableCode) {
							return (
								<div>
									<button
										type="button"
										onClick={() => setShowCodeRunner(false)}
										className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
									>
										<FaChevronLeft />
										<span>Back to Project Details</span>
									</button>

									<h3 className="text-2xl font-bold mb-4 text-gray-200">
										Interactive Demo: {selectedProject.title}
									</h3>

									<div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
										<p className="text-gray-300">
											{selectedProject.executableCode.description}
										</p>
									</div>

									<MultiLanguageRunner
										initialLanguage={selectedProject.executableCode.language}
										initialCode={selectedProject.executableCode.code}
									/>
								</div>
							);
						}

						return (
							<div>
								<button
									type="button"
									onClick={handleBackClick}
									className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
								>
									<FaChevronLeft />
									<span>Back to Projects</span>
								</button>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Project Structure */}
									<div className="bg-gray-800/50 rounded-lg p-4">
										<h3 className="text-xl font-semibold mb-4 text-gray-200">
											Project Structure
										</h3>
										<div className="font-mono text-sm">
											{selectedProject &&
												renderProjectStructure(
													selectedProject.structure as unknown as ProjectStructure,
												)}
										</div>
									</div>

									{/* Screenshots and Details */}
									<div className="bg-gray-800/50 rounded-lg p-4">
										<h3 className="text-xl font-semibold mb-4 text-gray-200">
											Project Details
										</h3>

										{/* Interactive Code Demo Button */}
										{selectedProject?.executableCode && (
											<div className="mb-4">
												<button
													type="button"
													onClick={handleRunCodeClick}
													className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
												>
													<FaPlay />
													Run Interactive{" "}
													{selectedProject.executableCode.language} Demo
												</button>
												<p className="text-sm text-gray-400 mt-2 text-center">
													{selectedProject.executableCode.description}
												</p>
											</div>
										)}

										{/* Screenshots */}
										{selectedProject?.images &&
											selectedProject.images.length > 0 && (
												<div className="mb-4">
													<h4 className="text-lg font-semibold mb-2 text-gray-200">
														Screenshots
													</h4>
													<div className="relative">
														<div className="rounded-lg overflow-hidden mb-2">
															<img
																src={
																	selectedProject.images[activeImageIndex].url
																}
																alt={
																	selectedProject.images[activeImageIndex].alt
																}
																className="w-full object-cover"
															/>
														</div>

														<div className="text-sm text-gray-300 mb-3">
															{
																selectedProject.images[activeImageIndex]
																	.description
															}
														</div>

														{selectedProject.images.length > 1 && (
															<div className="flex justify-between mt-2">
																<button
																	type="button"
																	onClick={handlePrevImage}
																	className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
																>
																	←
																</button>
																<span className="text-gray-400">
																	{activeImageIndex + 1} /{" "}
																	{selectedProject.images.length}
																</span>
																<button
																	type="button"
																	onClick={handleNextImage}
																	className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
																>
																	→
																</button>
															</div>
														)}
													</div>
												</div>
											)}

										{/* Demo Features */}
										{selectedProject?.demoFeatures && (
											<div className="mb-4">
												<h4 className="text-lg font-semibold mb-2 text-gray-200">
													Interactive Features
												</h4>
												<div className="space-y-2">
													{selectedProject.demoFeatures.map(
														(feature: string, index: number) => (
															<div
																key={`demo-feature-${index}-${feature}`}
																className="flex items-center gap-2 text-gray-300"
															>
																<div className="w-2 h-2 bg-green-400 rounded-full"></div>
																<span>{feature}</span>
															</div>
														),
													)}
												</div>
											</div>
										)}

										{/* Links */}
										<div className="space-y-2">
											{selectedProject?.repoUrl && (
												<a
													href={selectedProject.repoUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300 bg-gray-700/50 p-3 rounded-lg transition-colors"
												>
													<FaGithub />
													<span>View Source Code</span>
												</a>
											)}
											{selectedProject?.liveUrl && (
												<a
													href={selectedProject.liveUrl}
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
					})()}
				</div>
			</div>
		</DraggableWindow>
	);
};

export default GitHubViewer;
