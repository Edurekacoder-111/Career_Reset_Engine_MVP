import { useState, useRef } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateValueFromPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValueFromPosition = (e: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      onChange(Math.round(percentage));
    }
  };

  return (
    <div className={`p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm ${className}`}>
      <p className="font-semibold text-gray-900 mb-6 text-lg">{label}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl">😔</span>
        <div 
          className="flex-1 mx-6 relative"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Track background */}
          <div className="h-4 bg-gray-200 rounded-full relative overflow-hidden cursor-pointer">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${value}%` }}
            />
          </div>
          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={value}
            onChange={handleChange}
            className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
          />
          {/* Custom thumb */}
          <div 
            className={`absolute top-1/2 w-7 h-7 bg-white border-3 border-purple-600 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 ease-out cursor-grab ${isDragging ? 'scale-110 cursor-grabbing shadow-xl' : 'hover:scale-105'}`}
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
