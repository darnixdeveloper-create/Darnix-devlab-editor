import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  onSnapshot, 
  User 
} from './firebase';
import { Language, Snippet, FileData, CursorPos } from './types';
import { SNIPPETS } from './constants';
import LandingPage from './components/LandingPage';
import Editor from './components/Editor';
import { simulatePython, runJS, runSQL } from './services/codeRunner';
import { Cpu, FileJson, Globe, Database } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [files, setFiles] = useState<FileData[]>([
    { name: 'index.html', lang: 'html', content: SNIPPETS[3].code },
    { name: 'style.css', lang: 'html', content: '/* CSS yako hapa */\nbody { background: #0d1117; }' },
    { name: 'script.js', lang: 'javascript', content: 'console.log("Habari kutoka script.js!");' }
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [output, setOutput] = useState<string[]>(['// Karibu DevLab Tanzania!']);
  const [isRunning, setIsRunning] = useState(false);
  const [runTime, setRunTime] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cursorPos, setCursorPos] = useState<CursorPos>({ line: 1, col: 1 });
  const [autoRun, setAutoRun] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files[activeFileIndex];

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) return;

    const projectDoc = doc(db, 'projects', user.uid);
    const unsubscribe = onSnapshot(projectDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.files && JSON.stringify(data.files) !== JSON.stringify(files)) {
          setFiles(data.files);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-save effect
  useEffect(() => {
    if (!user) return;
    
    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await setDoc(doc(db, 'projects', user.uid), {
          uid: user.uid,
          files: files,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error('Save error:', err);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [files, user]);

  const KEYWORDS: Record<string, string[]> = {
    python: ['print', 'def', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'class', 'return', 'try', 'except', 'True', 'False', 'None', 'range', 'len', 'input', 'int', 'str', 'float', 'list', 'dict', 'set'],
    javascript: ['console.log', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'import', 'export', 'return', 'async', 'await', 'true', 'false', 'null', 'undefined', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'JSON', 'Math'],
    html: ['div', 'span', 'h1', 'h2', 'h3', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'script', 'style', 'link', 'meta', 'head', 'body', 'html', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'UPDATE', 'DELETE', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'OFFSET', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX']
  };

  // Auto-run effect
  useEffect(() => {
    if (!autoRun) return;

    const timer = setTimeout(() => {
      runCode();
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeFile.content, activeFile.lang, autoRun]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const newFiles = [...files];
    newFiles[activeFileIndex].content = val;
    setFiles(newFiles);
    updateCursorPos(e.target);
    handleAutocomplete(e.target);
  };

  const handleAutocomplete = (ta: HTMLTextAreaElement) => {
    const cursor = ta.selectionStart;
    const textBefore = ta.value.substring(0, cursor);
    const lastWordMatch = textBefore.match(/[\w.]+$/);

    if (lastWordMatch) {
      const lastWord = lastWordMatch[0].toLowerCase();
      const lang = activeFile.lang as string;
      const keywords = KEYWORDS[lang] || [];
      const matches = keywords.filter(k => k.toLowerCase().startsWith(lastWord));
      
      if (matches.length > 0 && lastWord.length > 0) {
        setSuggestions(matches);
        setShowSuggestions(true);
        setSuggestionIndex(0);
        
        const lines = textBefore.split('\n');
        const currentLine = lines.length;
        const currentCol = lines[lines.length - 1].length;
        setSuggestionPos({
          top: currentLine * 22 + 20,
          left: currentCol * 8 + 60
        });
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const cursor = ta.selectionStart;
    const textBefore = ta.value.substring(0, cursor);
    const textAfter = ta.value.substring(cursor);
    const lastWordMatch = textBefore.match(/[\w.]+$/);
    
    if (lastWordMatch) {
      const newTextBefore = textBefore.substring(0, textBefore.length - lastWordMatch[0].length) + suggestion;
      const newContent = newTextBefore + textAfter;
      const newFiles = [...files];
      newFiles[activeFileIndex].content = newContent;
      setFiles(newFiles);
      
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = newTextBefore.length;
        ta.focus();
      }, 0);
    }
    setShowSuggestions(false);
  };

  const updateCursorPos = (ta: HTMLTextAreaElement) => {
    const text = ta.value.substring(0, ta.selectionStart);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applySuggestion(suggestions[suggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = activeFile.content.substring(0, start) + '  ' + activeFile.content.substring(end);
      const newFiles = [...files];
      newFiles[activeFileIndex].content = newContent;
      setFiles(newFiles);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  const runCode = () => {
    if (!activeFile.content.trim()) return;
    
    setIsRunning(true);
    setStatus('idle');
    setOutput([]);
    const startTime = Date.now();

    if (activeFile.lang === 'html' || activeFile.name.endsWith('.html')) {
      setTimeout(() => {
        if (iframeRef.current) {
          let finalHtml = activeFile.content;
          const cssFiles = files.filter(f => f.name.endsWith('.css'));
          const cssContent = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
          finalHtml = finalHtml.replace('</head>', `${cssContent}\n</head>`);
          const jsFiles = files.filter(f => f.name.endsWith('.js') && f.name !== activeFile.name);
          const jsContent = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');
          finalHtml = finalHtml.replace('</body>', `${jsContent}\n</body>`);
          iframeRef.current.srcdoc = finalHtml;
        }
        setIsRunning(false);
        setStatus('success');
        setRunTime('preview');
      }, 100);
      return;
    }

    setTimeout(() => {
      try {
        let results: string[] = [];
        if (activeFile.lang === 'python') {
          results = simulatePython(activeFile.content);
        } else if (activeFile.lang === 'javascript') {
          results = runJS(activeFile.content);
        } else if (activeFile.lang === 'sql') {
          results = runSQL(activeFile.content);
        }

        setOutput(results);
        setStatus('success');
      } catch (err: any) {
        setOutput([`✗ Hitilafu: ${err.message}`]);
        setStatus('error');
      } finally {
        setIsRunning(false);
        setRunTime(`${Date.now() - startTime}ms`);
      }
    }, 150);
  };

  const createNewFile = () => {
    setIsCreatingFile(true);
    setNewFileName('');
  };

  const handleCreateFileSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newFileName) {
      setIsCreatingFile(false);
      return;
    }
    
    let newLang: Language = 'python';
    if (newFileName.endsWith('.js')) newLang = 'javascript';
    else if (newFileName.endsWith('.html')) newLang = 'html';
    else if (newFileName.endsWith('.css')) newLang = 'html';
    else if (newFileName.endsWith('.sql')) newLang = 'sql';
    
    const newFile: FileData = {
      name: newFileName,
      lang: newLang,
      content: ''
    };
    
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
    setIsCreatingFile(false);
    setNewFileName('');
    clearOutput();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const name = file.name;
        let lang: Language = 'python';
        if (name.endsWith('.js')) lang = 'javascript';
        else if (name.endsWith('.html')) lang = 'html';
        else if (name.endsWith('.css')) lang = 'html';
        else if (name.endsWith('.sql')) lang = 'sql';

        setFiles(prev => {
          if (prev.find(f => f.name === name)) return prev;
          return [...prev, { name, lang, content }];
        });
      };
      reader.readAsText(file);
    });
  };

  const handleFolderUpload = (e: any) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const name = file.webkitRelativePath || file.name;
        let lang: Language = 'python';
        if (name.endsWith('.js')) lang = 'javascript';
        else if (name.endsWith('.html')) lang = 'html';
        else if (name.endsWith('.css')) lang = 'html';
        else if (name.endsWith('.sql')) lang = 'sql';

        setFiles(prev => {
          if (prev.find(f => f.name === name)) return prev;
          return [...prev, { name, lang, content }];
        });
      };
      reader.readAsText(file);
    });
  };

  const deleteFile = (index: number) => {
    if (files.length === 1) return;
    setFileToDelete(index);
  };

  const confirmDelete = () => {
    if (fileToDelete === null) return;
    const newFiles = files.filter((_, i) => i !== fileToDelete);
    setFiles(newFiles);
    if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(Math.max(0, newFiles.length - 1));
    } else if (activeFileIndex === fileToDelete) {
      setActiveFileIndex(Math.max(0, activeFileIndex - 1));
    }
    setFileToDelete(null);
  };

  const clearAllFiles = () => {
    setFiles([{ name: 'untitled.py', lang: 'python', content: '' }]);
    setActiveFileIndex(0);
    setShowClearAllConfirm(false);
    clearOutput();
  };

  const loadSnippet = (s: Snippet) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].lang = s.lang;
    newFiles[activeFileIndex].content = s.code;
    setFiles(newFiles);
    clearOutput();
  };

  const getLangIcon = (l: Language) => {
    switch(l) {
      case 'python': return <Cpu className="w-4 h-4" />;
      case 'javascript': return <FileJson className="w-4 h-4" />;
      case 'html': return <Globe className="w-4 h-4" />;
      case 'sql': return <Database className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLangColor = (l: Language) => {
    switch(l) {
      case 'python': return 'text-[#ff7b72]';
      case 'javascript': return 'text-[#d2a8ff]';
      case 'html': return 'text-[#7ee787]';
      case 'sql': return 'text-[#58a6ff]';
      default: return '';
    }
  };

  const clearOutput = () => {
    setOutput(['// Matokeo yamefutwa. Endesha msimbo mpya...']);
    setRunTime(null);
    setStatus('idle');
  };

  const handleLangChange = (newLang: Language) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].lang = newLang;
    const nameParts = newFiles[activeFileIndex].name.split('.');
    const ext = newLang === 'python' ? 'py' : newLang === 'javascript' ? 'js' : newLang === 'html' ? 'html' : 'sql';
    newFiles[activeFileIndex].name = `${nameParts[0]}.${ext}`;
    setFiles(newFiles);
    const defaultSnippet = SNIPPETS.find(s => s.lang === newLang);
    if (defaultSnippet) {
      newFiles[activeFileIndex].content = defaultSnippet.code;
    }
    clearOutput();
  };

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-blocked') {
        setLoginError('Kivinjari chako kimezuia dirisha la kuingia. Tafadhali ruhusu "popups" kwa tovuti hii.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setLoginError('Ombi la kuingia lilighairiwa. Tafadhali jaribu tena.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('Ulifunga dirisha la kuingia kabla ya kukamilisha. Jaribu tena.');
      } else {
        setLoginError(`Hitilafu ya kuingia (${err.code || err.message}). Tafadhali hakikisha umeruhusu domain ya Vercel kwenye Firebase Console.`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!authReady) {
    return (
      <div className="h-screen w-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <LandingPage 
        handleLogin={handleLogin} 
        handleGuestEntry={() => setGuestMode(true)}
        loginError={loginError} 
        setLoginError={setLoginError} 
      />
    );
  }

  return (
    <Editor 
      {...{
        files, activeFileIndex, setActiveFileIndex, output, isRunning, runTime, status,
        cursorPos, autoRun, setAutoRun, isSaving, isCreatingFile, setIsCreatingFile,
        newFileName, setNewFileName, fileToDelete, setFileToDelete, showClearAllConfirm,
        setShowClearAllConfirm, user, handleLogout, handleCreateFileSubmit, deleteFile, confirmDelete,
        clearAllFiles, handleFileUpload, handleFolderUpload, runCode, clearOutput,
        loadSnippet, handleTextareaChange, handleKeyDown, handleLangChange, getLangIcon, getLangColor,
        textareaRef, outputRef, iframeRef, fileInputRef, folderInputRef, SNIPPETS, showSuggestions, 
        suggestions, suggestionIndex, suggestionPos, applySuggestion, createNewFile
      }}
    />
  );
}
