import React from 'react';
import { CharacterData } from '../types';

interface InfoCardProps {
  data: CharacterData | null;
  loading: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-24 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-md p-8 bg-paper-beige border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 font-serif">
        请输入汉字开始学习
        <br/>
        <span className="text-sm">Please enter a character to begin</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border-t-4 border-seal-red overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-baseline border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-5xl font-serif font-bold text-ink-black">{data.character}</h2>
          <div className="text-right">
            <p className="text-3xl font-sans font-medium text-seal-red">{data.pinyin}</p>
            <p className="text-sm text-gray-500">部首: {data.radical} | 笔画: {data.strokeCount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Definition</h3>
            <p className="text-lg text-gray-800 font-serif leading-relaxed">{data.definition}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Etymology</h3>
            <p className="text-gray-700 text-sm italic bg-paper-beige p-3 rounded border border-gray-100">
              "{data.etymology}"
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Examples</h3>
            <ul className="space-y-3">
              {data.examples.map((ex, idx) => (
                <li key={idx} className="group">
                  <p className="font-medium text-lg text-ink-black group-hover:text-seal-red transition-colors">{ex.chinese}</p>
                  <p className="text-sm text-gray-500 font-mono">{ex.pinyin}</p>
                  <p className="text-sm text-gray-600">{ex.meaning}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-400 text-center">
        AI generated content by Tim (Gemini)
      </div>
    </div>
  );
};

export default InfoCard;