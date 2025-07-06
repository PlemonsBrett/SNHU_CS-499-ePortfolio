import type { SupportedLanguage } from "./types";

export interface MultiLanguageRunnerProps {
	initialLanguage?: SupportedLanguage;
	initialCode?: string;
	onCodeChange?: (code: string) => void;
}