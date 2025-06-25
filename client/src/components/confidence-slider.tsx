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
    <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
      <p className="font-medium mb-3">{label}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl">😔</span>
        <div className="flex-1 mx-4">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="w-full confidence-slider"
          />
        </div>
        <span className="text-2xl">😊</span>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">{value}% confident</p>
    </div>
  );
}
