import type { Language } from "../MultiLanguageRunner/types";
import { elixir } from "./elixir";
import { rust } from "./rust";
import { golang } from "./golang";
import { python } from "./python";
import { scala } from "./scala";
import { voiceConversion } from "./voice-conversion";

export const languages: Language[] = [
  elixir,
  rust,
  golang,
  python,
  scala,
  voiceConversion,
];