import { User } from './firebase';

export type Language = 'python' | 'javascript' | 'html' | 'sql';

export interface Snippet {
  id: string;
  title: string;
  desc: string;
  lang: Language;
  code: string;
}

export interface FileData {
  name: string;
  lang: Language | string;
  content: string;
}

export interface CursorPos {
  line: number;
  col: number;
}
