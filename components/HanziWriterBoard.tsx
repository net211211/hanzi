import React, { useEffect, useRef, useState } from 'react';
import { HanziWriterInstance } from '../types';

interface HanziWriterBoardProps {
  character: string;
  size?: number;
}

const HanziWriterBoard: React.FC<HanziWriterBoardProps> = ({ character, size = 300 }) => {
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstance = useRef<HanziWriterInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!writerRef.current || !character) return;

    // Clear previous instance visual
    writerRef.current.innerHTML = '';
    setIsLoaded(false);

    try {
      if (window.HanziWriter) {
        writerInstance.current = window.HanziWriter.create(writerRef.current, character, {
          width: size,
          height: size,
          padding: 5,
          showOutline: true,
          strokeAnimationSpeed: 1, // 1x speed
          delayBetweenStrokes: 200, // ms
          radicalColor: '#b92b27', // Seal red for radical
          strokeColor: '#1a1a1a', // Ink black
        });
        setIsLoaded(true);
        // Initial animation
        writerInstance.current.animateCharacter();
      } else {
        console.error("HanziWriter script not loaded.");
      }
    } catch (err) {
      console.error("Error initializing HanziWriter:", err);
    }

    // Cleanup
    return () => {
      if (writerInstance.current) {
        // Try to cancel any active quiz
        try {
           writerInstance.current.cancelQuiz();
        } catch (e) {
           // Ignore if method not available or fails
        }
      }
      writerInstance.current = null;
    };
  }, [character, size]);

  const animate = () => writerInstance.current?.animateCharacter();
  const quiz = () => writerInstance.current?.quiz();

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative p-4 bg-white shadow-xl rounded-sm border border-gray-200 group">
         
         {/* Preview Mode Badge */}
         <div className="absolute top-2 left-2 -translate-x-2 -translate-y-2 z-20 bg-gray-100 text-gray-500 text-xs font-serif px-2 py-1 rounded shadow-sm select-none">
            预览模式
         </div>

         {/* Container for the grid background */}
        <div 
          className="tian-zi-ge relative" 
          style={{ width: size, height: size }}
        >
           <div className="cross-grid"></div>
           {/* Target div for Hanzi Writer SVG */}
           <div ref={writerRef} className="absolute top-0 left-0 z-10" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-500 font-serif mb-4 text-sm animate-fade-in">
          准备就绪！选择模式开始。
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={animate}
            disabled={!isLoaded}
            className="px-6 py-2 bg-blue-500 text-white font-serif rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            演示笔画
          </button>
          
          <button 
            onClick={quiz}
            disabled={!isLoaded}
            className="px-6 py-2 bg-ink-black text-white font-serif rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            开始描红
          </button>
        </div>
      </div>
    </div>
  );
};

export default HanziWriterBoard;