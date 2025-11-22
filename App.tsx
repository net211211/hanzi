import React, { useState, useEffect } from 'react';
import HanziWriterBoard from './components/HanziWriterBoard';
import InfoCard from './components/InfoCard';
import { fetchCharacterData } from './services/geminiService';
import { CharacterData } from './types';

const App: React.FC = () => {
  const [inputChar, setInputChar] = useState('');
  const [activeChar, setActiveChar] = useState<string>(''); // The char currently being displayed
  const [charData, setCharData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardSize, setBoardSize] = useState(300);

  // Handle responsive sizing for the board
  useEffect(() => {
    const handleResize = () => {
      // Calculate appropriate size: Full width minus padding on mobile, max 400px on desktop
      const newSize = Math.min(window.innerWidth - 32, 400);
      setBoardSize(newSize);
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search
  const handleSearch = async () => {
    const char = inputChar.trim();
    // Simple regex to check if it's a Chinese character (basic range)
    if (!char || !/^[\u4E00-\u9FA5]$/.test(char)) {
      setError("请输入单个汉字 (Please enter a single Chinese character)");
      return;
    }

    setError(null);
    setLoading(true);
    setActiveChar(char);
    setCharData(null); // Reset data while loading

    try {
      const data = await fetchCharacterData(char);
      setCharData(data);
    } catch (err) {
      console.error(err);
      setError("无法获取字符详情，请检查网络或稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-seal-red selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-seal-red rounded text-white flex items-center justify-center font-serif font-bold text-xl">
              文
            </div>
            <h1 className="text-2xl font-calligraphy text-ink-black tracking-wider">Tim汉字笔画学习器</h1>
          </div>
          <nav className="text-sm text-gray-500 hidden sm:block">
            Gemini 驱动 • 笔画演示 • 智能解析
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-10 px-4 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]">
        
        {/* Search Section */}
        <div className="w-full max-w-md mb-12 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputChar}
              onChange={(e) => setInputChar(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入一个汉字 (如: 龙)"
              className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-300 focus:border-seal-red focus:ring-4 focus:ring-red-50 outline-none transition-all shadow-sm text-center font-serif"
              maxLength={1}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !inputChar}
              className="absolute right-2 top-2 bottom-2 bg-seal-red text-white px-6 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '...' : '生成笔画'}
            </button>
          </div>
          {error && (
            <p className="absolute -bottom-8 left-0 w-full text-center text-red-500 text-sm bg-white/80 py-1 rounded">
              {error}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Animation Board */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
             {activeChar ? (
               <HanziWriterBoard character={activeChar} size={boardSize} />
             ) : (
               <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300">
                 <div className="text-center">
                    <span className="text-6xl block mb-4 opacity-20">字</span>
                    等待输入...
                 </div>
               </div>
             )}
          </div>

          {/* Right Column: Info Card */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-2">
            <InfoCard data={charData} loading={loading} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ink-black text-white py-8 text-center">
        <p className="font-serif text-gray-400 text-sm">
          Tim汉字笔画学习器 &copy; {new Date().getFullYear()} 由 Tim 制作
        </p>
        <p className="text-xs text-gray-600 mt-2">
          基于 Hanzi Writer 与 Google Gemini API 构建
        </p>
      </footer>
    </div>
  );
};

export default App;