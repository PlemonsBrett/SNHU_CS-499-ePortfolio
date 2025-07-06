import { languages } from '../../../languages/index';
import type { LanguageSelectorProps } from './props';
import type { Language } from '../../types';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
	return (
		<select
			value={selectedLanguage.id}
			onChange={(e) => onLanguageChange(e.target.value)}
			className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
		>
			{languages.map((lang: Language) => (
				<option key={lang.id} value={lang.id}>
					{lang.name} - {lang.aiMlFocus}
				</option>
			))}
		</select>
	);
};

export default LanguageSelector;