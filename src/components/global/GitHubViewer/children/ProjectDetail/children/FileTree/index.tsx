import { FaFolder } from "react-icons/fa";
import { useFileTreeState, renderFileTree } from "./functions";
import type { FileTreeProps } from "./props";

const FileTree = ({ structure }: FileTreeProps) => {
	const { expandedNodes, toggleNode } = useFileTreeState();

	return (
		<div className="bg-gray-800/50 rounded-lg p-4">
			<h3 className="text-xl font-semibold mb-4 text-gray-200">
				Project Structure
			</h3>
			<div className="font-mono text-sm">
				<div className="flex items-center p-1 rounded">
					<FaFolder className="text-yellow-500 mr-2" />
					<span className="text-gray-200 font-bold">{structure.root}</span>
				</div>
				<div className="ml-4">
					{structure.children.map((child) =>
						renderFileTree(child, structure.root, expandedNodes, toggleNode),
					)}
				</div>
			</div>
		</div>
	);
};

export default FileTree;