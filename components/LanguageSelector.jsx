import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui";

const LanguageSelector = ({ languages, value, onChange, disabled, label }) => {
  const selectedLanguage = languages.find(lang => lang.code === value);

  return (
    <div className="flex-1">
      <label className="text-white text-lg font-medium mb-2 flex items-center">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2 text-base text-white">
            <span>{selectedLanguage?.flag}</span>
            <span>{selectedLanguage?.name || "Select language"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2 text-base">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
