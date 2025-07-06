import { useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import type { FileNode } from "./types";

export const useFileTreeState = () => {
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

	const toggleNode = (path: string) => {
		const newExpandedNodes = new Set(expandedNodes);
		if (newExpandedNodes.has(path)) {
			newExpandedNodes.delete(path);
		} else {
			newExpandedNodes.add(path);
		}
		setExpandedNodes(newExpandedNodes);
	};

	return { expandedNodes, toggleNode };
};

export const renderFileTree = (
	node: FileNode,
	expandedNodes: Set<string>,
	toggleNode: (path: string) => void,
	path: string = "",
) => {
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
					{node.children.map((child) =>
						renderFileTree(child, expandedNodes, toggleNode, currentPath),
					)}
				</div>
			)}
		</div>
	);
};