import type { Language } from "../../types";

export interface CodeEditorProps {
	selectedLanguage: Language;
	code: string;
	onCodeChange: (value: string | undefined) => void;
}