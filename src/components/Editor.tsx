import React from 'react';
import { 
  Play, 
  Trash2, 
  Code2, 
  FileJson, 
  Globe, 
  Database, 
  CheckCircle2, 
  ChevronRight,
  Terminal,
  Layers,
  Cpu,
  BookOpen,
  LogOut,
  User as UserIcon,
  Plus,
  Save,
  Cloud,
  CloudOff,
  Github,
  Monitor,
  Zap,
  Shield,
  ArrowRight,
  FilePlus,
  FolderPlus,
  Upload,
  Folder,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileData, Language, Snippet, CursorPos } from '../types';

interface EditorProps {
  files: FileData[];
  activeFileIndex: number;
  setActiveFileIndex: (index: number) => void;
  output: string[];
  isRunning: boolean;
  runTime: string | null;
  status: 'idle' | 'success' | 'error';
  cursorPos: CursorPos;
  autoRun: boolean;
  setAutoRun: (auto: boolean) => void;
  isSaving: boolean;
  isCreatingFile: boolean;
  setIsCreatingFile: (creating: boolean) => void;
  newFileName: string;
  setNewFileName: (name: string) => void;
  fileToDelete: number | null;
  setFileToDelete: (index: number | null) => void;
  showClearAllConfirm: boolean;
  setShowClearAllConfirm: (show: boolean) => void;
  user: any;
  handleLogout: () => void;
  handleCreateFileSubmit: (e?: React.FormEvent) => void;
  deleteFile: (index: number) => void;
  confirmDelete: () => void;
  clearAllFiles: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFolderUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  runCode: () => void;
  clearOutput: () => void;
  loadSnippet: (s: Snippet) => void;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleLangChange: (l: Language) => void;
  getLangIcon: (l: Language) => React.ReactNode;
  getLangColor: (l: Language) => string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  outputRef: React.RefObject<HTMLDivElement>;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  SNIPPETS: Snippet[];
  showSuggestions: boolean;
  suggestions: string[];
  suggestionIndex: number;
  suggestionPos: { top: number; left: number };
  applySuggestion: (s: string) => void;
  createNewFile: () => void;
}

const Editor: React.FC<EditorProps> = (props) => {
  const {
    files, activeFileIndex, setActiveFileIndex, output, isRunning, runTime, status,
    cursorPos, autoRun, setAutoRun, isSaving, isCreatingFile, setIsCreatingFile,
    newFileName, setNewFileName, fileToDelete, setFileToDelete, showClearAllConfirm,
    setShowClearAllConfirm, user, handleLogout, handleCreateFileSubmit, deleteFile, confirmDelete,
    clearAllFiles, handleFileUpload, handleFolderUpload, runCode, clearOutput,
    loadSnippet, handleTextareaChange, handleKeyDown, handleLangChange, getLangIcon, getLangColor,
    textareaRef, outputRef, iframeRef, fileInputRef, folderInputRef, SNIPPETS, showSuggestions, 
    suggestions, suggestionIndex, suggestionPos, applySuggestion, createNewFile
  } = props;

  const activeFile = files[activeFileIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-main)]">
      {/* Modals */}
      <AnimatePresence>
        {(fileToDelete !== null || showClearAllConfirm) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-[#ff7b72]">
                <Trash2 className="w-6 h-6" />
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {showClearAllConfirm ? 'Futa Faili Zote?' : 'Futa Faili?'}
                </h3>
              </div>
              
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                {showClearAllConfirm 
                  ? 'Je, una uhakika unataka kufuta faili zote? Kitendo hiki hakiwezi kurudishwa.' 
                  : `Je, una uhakika unataka kufuta "${files[fileToDelete!].name}"?`}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => { setFileToDelete(null); setShowClearAllConfirm(false); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-editor)] text-[var(--text-primary)] font-medium hover:bg-[var(--border)] transition-colors"
                >
                  Ghairi
                </button>
                <button 
                  onClick={showClearAllConfirm ? clearAllFiles : confirmDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#ff7b72] text-white font-medium hover:bg-[#ff7b72]/80 transition-colors"
                >
                  Futa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="h-[50px] bg-[var(--bg-sidebar)] border-b border-[var(--border)] flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-[var(--accent)] font-semibold text-lg flex items-center gap-2">
            <span className="font-mono">&lt;/&gt;</span>
            <span className="tracking-tight hidden sm:inline">DevLab Tanzania</span>
          </div>
          <div className="h-4 w-px bg-[var(--border)] mx-2 hidden sm:block" />
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            {isSaving ? (
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <Cloud className="w-3.5 h-3.5" />
                Inahifadhi...
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Imehifadhiwa
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mr-2 hidden md:inline">Lugha:</span>
          <nav className="flex items-center gap-1 bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border)]">
            {(['python', 'javascript', 'html', 'sql'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeFile.lang === l 
                    ? 'bg-[var(--bg-editor)] text-[var(--accent)] border border-[var(--border)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className={activeFile.lang === l ? getLangColor(l) : 'text-[var(--text-secondary)]'}>
                  {getLangIcon(l)}
                </span>
                <span className="hidden lg:inline">{l === 'html' ? 'HTML/CSS' : l}</span>
                <span className="lg:hidden">{l === 'html' ? 'HTML' : l.slice(0, 2)}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-main)]">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Auto-run</span>
            <button 
              onClick={() => setAutoRun(!autoRun)}
              className={`w-8 h-4 rounded-full relative transition-colors ${autoRun ? 'bg-[var(--success)]' : 'bg-[var(--border)]'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoRun ? 'left-[17px]' : 'left-0.5'}`} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-[var(--border)]" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} 
                alt="Profile" 
                className="w-7 h-7 rounded-full border border-[var(--border)]"
                referrerPolicy="no-referrer"
              />
              <span className="text-[12px] font-medium text-[var(--text-primary)] hidden lg:inline">{user?.displayName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-[var(--bg-editor)] rounded-md transition-colors text-[var(--text-secondary)] hover:text-[#ff7b72]"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col shrink-0">
          <div className="p-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Mchunguzi</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={createNewFile}
                  className="p-1 hover:bg-[var(--bg-editor)] rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--accent)]"
                  title="New File"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => folderInputRef.current?.click()}
                  className="p-1 hover:bg-[var(--bg-editor)] rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--accent)]"
                  title="Upload Folder"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-[var(--bg-editor)] rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--accent)]"
                  title="Upload File"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setShowClearAllConfirm(true)}
                  className="p-1 hover:bg-[var(--bg-editor)] rounded transition-colors text-[var(--text-secondary)] hover:text-[#ff7b72]"
                  title="Clear All Files"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hidden Inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple 
            />
            <input 
              type="file" 
              ref={folderInputRef} 
              onChange={handleFolderUpload} 
              className="hidden" 
              {...{ webkitdirectory: "", directory: "" } as any} 
            />

            <div className="space-y-0.5 mb-6">
              {isCreatingFile && (
                <div className="px-3 py-1 flex items-center gap-2 bg-[var(--bg-editor)] border border-[var(--accent)] rounded-md mb-1">
                  <FileJson className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <form onSubmit={handleCreateFileSubmit} className="flex-1">
                    <input
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={() => handleCreateFileSubmit()}
                      className="bg-transparent border-none outline-none text-[12px] text-[var(--text-primary)] w-full"
                      placeholder="jina.py"
                    />
                  </form>
                </div>
              )}
              {files.map((file, i) => (
                <div 
                  key={i}
                  className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                    activeFileIndex === i ? 'bg-[var(--bg-editor)] border border-[var(--border)]' : 'hover:bg-[var(--bg-editor)]/50'
                  }`}
                  onClick={() => setActiveFileIndex(i)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={getLangColor(file.lang as Language)}>{getLangIcon(file.lang as Language)}</span>
                    <span className={`text-[12px] truncate ${activeFileIndex === i ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                      {file.name}
                    </span>
                  </div>
                  {files.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteFile(i); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#ff7b72] transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="h-px bg-[var(--border)] my-6" />

            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Mifano</span>
            </div>
            
            <div className="space-y-1">
              {SNIPPETS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSnippet(s)}
                  className="w-full text-left p-3 rounded-md hover:bg-[var(--bg-editor)] border border-transparent hover:border-[var(--border)] transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{s.title}</span>
                    <span className={`text-[10px] font-bold uppercase ${getLangColor(s.lang)}`}>{s.lang.slice(0, 2)}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-main)]">
          <div className="h-[35px] bg-[var(--bg-sidebar)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">{activeFile.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--success)] hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                Run
              </button>
              <button 
                onClick={clearOutput}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden bg-[var(--border)] gap-[1px] relative">
            {/* Autocomplete Popup */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-50 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-md shadow-2xl min-w-[150px] overflow-hidden"
                  style={{ top: suggestionPos.top, left: suggestionPos.left }}
                >
                  {suggestions.map((s, i) => (
                    <div
                      key={s}
                      className={`px-3 py-1.5 text-[12px] font-mono cursor-pointer flex items-center justify-between ${
                        suggestionIndex === i ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-primary)] hover:bg-[var(--bg-editor)]'
                      }`}
                      onClick={() => applySuggestion(s)}
                    >
                      <span>{s}</span>
                      <span className="text-[10px] opacity-50">keyword</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col bg-[var(--bg-editor)] relative">
              <div className="flex flex-1 overflow-hidden">
                <div className="w-12 bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col py-5 items-end pr-3 select-none shrink-0">
                  {activeFile.content.split('\n').map((_, i) => (
                    <span key={i} className="text-[14px] font-mono text-[#484f58] leading-[1.6]">{i + 1}</span>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={activeFile.content}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  onScroll={(e) => {
                    const ln = e.currentTarget.previousSibling as HTMLElement;
                    if (ln) ln.scrollTop = e.currentTarget.scrollTop;
                  }}
                  spellCheck={false}
                  className="flex-1 bg-transparent p-5 outline-none resize-none font-mono text-[14px] leading-[1.6] text-[var(--text-primary)] caret-[var(--accent)] overflow-y-auto whitespace-pre"
                />
              </div>
              
              <footer className="h-[25px] bg-[var(--bg-sidebar)] border-t border-[var(--border)] flex items-center px-4 gap-5 shrink-0">
                <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  Tayari Kazi
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Mstari {cursorPos.line}, Safu {cursorPos.col}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] uppercase">
                  {activeFile.lang === 'html' ? 'HTML5 / CSS3' : (activeFile.lang as string).toUpperCase()}
                </div>
              </footer>
            </div>

            {/* Output Panel */}
            <div className="w-[450px] flex flex-col bg-[var(--bg-editor)] shrink-0">
              <div className="h-[35px] bg-[var(--bg-sidebar)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Live Preview</span>
                  <AnimatePresence>
                    {isRunning ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" 
                      />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-[var(--success)]' : status === 'error' ? 'bg-[#ff7b72]' : 'bg-[var(--text-secondary)]'}`} />
                    )}
                  </AnimatePresence>
                </div>
                {runTime && (
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">{runTime}</span>
                )}
              </div>

              <div className="flex-1 relative overflow-hidden">
                <div className={`w-full h-full bg-white flex flex-col ${activeFile.lang === 'html' || activeFile.name.endsWith('.html') ? 'block' : 'hidden'}`}>
                  <div className="h-6 bg-[#eee] border-b border-[#ccc] flex items-center px-2 gap-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ccc]" />
                    <div className="w-2 h-2 rounded-full bg-[#ccc]" />
                    <div className="w-2 h-2 rounded-full bg-[#ccc]" />
                  </div>
                  <iframe 
                    ref={iframeRef}
                    title="preview"
                    className="flex-1 w-full border-none"
                    sandbox="allow-scripts"
                  />
                </div>
                
                <div 
                  ref={outputRef}
                  className={`absolute inset-0 p-5 font-mono text-[14px] leading-[1.6] overflow-y-auto bg-[var(--bg-editor)] ${activeFile.lang === 'html' || activeFile.name.endsWith('.html') ? 'hidden' : 'block'}`}
                >
                  {output.map((line, i) => (
                    <div 
                      key={i} 
                      className={`mb-1 ${
                        line.startsWith('✗') || line.startsWith('ERROR:') ? 'text-[#ff7b72]' :
                        line.startsWith('✓') ? 'text-[var(--success)]' :
                        line.startsWith('//') ? 'text-[var(--comment)] italic' :
                        line.startsWith('WARN:') ? 'text-[#f5a623]' :
                        'text-[var(--text-primary)]'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Editor;
