import type { ExecutableCode } from "./types";

export interface CodeRunnerProps {
	projectTitle: string;
	executableCode: ExecutableCode;
	onBack: () => void;
}