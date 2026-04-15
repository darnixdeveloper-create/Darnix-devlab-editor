import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Shield, 
  Trash2, 
  Monitor, 
  Github, 
  Play, 
  Zap, 
  Cloud 
} from 'lucide-react';

interface LandingPageProps {
  handleLogin: () => void;
  loginError: string | null;
  setLoginError: (error: string | null) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ handleLogin, loginError, setLoginError }) => {
  return (
    <div className="h-screen w-screen bg-[var(--bg-main)] overflow-y-auto overflow-x-hidden">
      {/* Landing Page */}
      <nav className="h-20 px-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--accent)]/20">
            &lt;/&gt;
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">DevLab Tanzania</span>
        </div>
        <button 
          onClick={handleLogin}
          className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-full font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[var(--accent)]/20 flex items-center gap-2"
        >
          Anza Sasa Bure
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-10 max-w-7xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)]/10 blur-[120px] rounded-full -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center justify-center gap-3 max-w-md mx-auto"
              >
                <Shield className="w-5 h-5 shrink-0" />
                <p>{loginError}</p>
                <button onClick={() => setLoginError(null)} className="ml-auto hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            <span className="px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold mb-6 inline-block border border-[var(--accent)]/20">
              🚀 Jifunze Coding kwa Kiswahili
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight leading-[1.1]">
              Mazingira ya Kisasa ya <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#7ee787]">Kujifunza Programu</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
              DevLab Tanzania inakupa uwezo wa kuandika, kuendesha, na kuhifadhi kodi zako mtandaoni. Python, JavaScript, HTML, na SQL - yote katika sehemu moja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="w-full sm:w-auto px-10 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[var(--accent)]/30 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Monitor className="w-5 h-5" />
                Fungua Mhariri wa Kodi
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-[var(--bg-sidebar)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl font-bold text-lg hover:bg-[var(--bg-editor)] transition-all flex items-center justify-center gap-3">
                <Github className="w-5 h-5" />
                Tazama Kwenye GitHub
              </button>
            </div>
          </motion.div>

          {/* Editor Preview Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 rounded-3xl border border-[var(--border)] bg-[var(--bg-sidebar)] p-4 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent opacity-60" />
            <img 
              src="https://picsum.photos/seed/coding-lab/1920/1080" 
              alt="DevLab Editor Preview" 
              className="rounded-2xl w-full object-cover h-[500px] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-24 px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[var(--bg-sidebar)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all group">
            <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Auto-run ya Haraka</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Ona matokeo ya kodi yako papo hapo unapoandika. Hakuna haja ya kusubiri au kurefresh kivinjari chako.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[var(--bg-sidebar)] border border-[var(--border)] hover:border-[#7ee787]/50 transition-all group">
            <div className="w-14 h-14 bg-[#7ee787]/10 rounded-2xl flex items-center justify-center text-[#7ee787] mb-6 group-hover:scale-110 transition-transform">
              <Cloud className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Hifadhi ya Wingu</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Kodi zako zinahifadhiwa automatic kwenye akaunti yako. Unaweza kuendelea pale ulipoishia kutoka kifaa chochote.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[var(--bg-sidebar)] border border-[var(--border)] hover:border-[#d2a8ff]/50 transition-all group">
            <div className="w-14 h-14 bg-[#d2a8ff]/10 rounded-2xl flex items-center justify-center text-[#d2a8ff] mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Usalama wa Juu</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Tunatumia Firebase kuhakikisha data zako ziko salama na akaunti yako inalindwa kwa viwango vya kimataifa.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 px-10 border-t border-[var(--border)] text-center text-[var(--text-secondary)]">
        <p>© 2024 DevLab Tanzania. Imetengenezwa kwa ajili ya Watanzania.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
