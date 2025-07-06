import type { Language } from "../../types";

export interface LanguageSelectorProps {
	selectedLanguage: Language;
	onLanguageChange: (langId: string) => void;
}