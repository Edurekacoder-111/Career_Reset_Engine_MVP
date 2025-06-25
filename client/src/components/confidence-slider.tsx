import { useState } from "react";

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export default function ConfidenceSlider({ 
  value, 
  onChange, 
  label = "How confident are you about your career direction?",
  className = ""
}: ConfidenceSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className={`p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm ${className}`}>
      <p className="font-semibold text-gray-900 mb-6 text-lg">{label}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl">😔</span>
        <div className="flex-1 mx-6 relative">
          {/* Track background */}
          <div className="h-3 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${value}%` }}
            />
          </div>
          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
          />
          {/* Custom thumb */}
          <div 
            className="absolute top-1/2 w-6 h-6 bg-white border-3 border-purple-600 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200 hover:scale-110"
            style={{ left: `${value}%` }}
          />
        </div>
        <span className="text-3xl">😊</span>
      </div>
      <p className="text-lg font-semibold text-purple-600 text-center bg-purple-50 py-2 px-4 rounded-lg">
        {value}% confident
      </p>
    </div>
  );
}
