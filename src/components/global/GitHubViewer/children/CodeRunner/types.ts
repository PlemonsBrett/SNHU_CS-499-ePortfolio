export type ExecutableCode = {
	language: "javascript" | "typescript" | "python" | "rust" | "cpp" | "go";
	code: string;
	description: string;
};