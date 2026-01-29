"use client";

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white h-[800px] max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col border-[8px] border-white ring-1 ring-gray-900/5">

        {/* Status Bar Mock */}
        <div className="h-6 w-full absolute top-0 left-0 z-50 flex justify-between items-center px-6 mt-2">
           <span className="text-xs font-medium text-gray-400">9:41</span>
           <div className="flex gap-1">
             <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></div>
             <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-8">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1.5 bg-gray-300 rounded-full mb-2"></div>
      </div>
    </div>
  );
};
