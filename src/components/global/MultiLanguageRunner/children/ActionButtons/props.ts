import type { Language } from "../../types";

export interface ActionButtonsProps {
	isRunning: boolean;
	pyodideReady: boolean;
	selectedLanguage: Language;
	onExecuteCode: () => void;
	onCopyCode: () => void;
	onDownloadCode: () => void;
}