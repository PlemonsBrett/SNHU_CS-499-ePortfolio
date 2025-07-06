export type FileNode = {
	name: string;
	type: "file" | "directory";
	children?: readonly FileNode[];
};

export type ProjectStructure = {
	root: string;
	children: readonly FileNode[];
};