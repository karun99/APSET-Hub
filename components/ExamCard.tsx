
import React from 'react';
import { ExamInfo } from '../types';

interface ExamCardProps {
  info: ExamInfo;
}

export const ExamCard: React.FC<ExamCardProps> = ({ info }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
        <i className={`fas ${info.icon} text-xl`}></i>
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-800">{info.title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {info.description}
      </p>
    </div>
  );
};
