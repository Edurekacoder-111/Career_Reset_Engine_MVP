import { useState, useRef, useEffect, useCallback } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setIsTransitioning(true);
    onChange(newValue);
    setTimeout(() => setIsTransitioning(false), 100);
  };

  const updateValueFromPosition = useCallback((clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(Math.round(percentage));
    }
  }, [onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromPosition(e.touches[0].clientX);
  };

  // Global mouse and touch event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateValueFromPosition(e.clientX);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateValueFromPosition(e.touches[0].clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, updateValueFromPosition]);

  return (
    <div className={`p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm ${className}`}>
      <p className="font-semibold text-gray-900 mb-6 text-lg">{label}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl">😔</span>
        <div 
          className="flex-1 mx-6 relative select-none"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Track background */}
          <div className="h-4 bg-gray-200 rounded-full relative overflow-hidden cursor-pointer touch-manipulation">
            {/* Progress fill */}
            <div 
              className={`h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full ${
                isDragging || isTransitioning 
                  ? 'transition-none' 
                  : 'transition-all duration-300 ease-out'
              }`}
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
            className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer touch-manipulation"
            style={{ touchAction: 'none' }}
          />
          {/* Custom thumb */}
          <div 
            className={`absolute top-1/2 w-7 h-7 bg-white border-3 border-purple-600 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-grab touch-manipulation ${
              isDragging 
                ? 'scale-110 cursor-grabbing shadow-xl transition-none' 
                : isTransitioning
                ? 'transition-all duration-300 ease-out hover:scale-105'
                : 'transition-all duration-200 ease-out hover:scale-105'
            }`}
            style={{ 
              left: `${value}%`,
              willChange: isDragging ? 'transform' : 'auto'
            }}
          />
        </div>
        <span className="text-3xl">😊</span>
      </div>
      <p className={`text-lg font-semibold text-purple-600 text-center bg-purple-50 py-2 px-4 rounded-lg ${
        isDragging ? 'transition-none' : 'transition-all duration-200 ease-out'
      }`}>
        {value}% confident
      </p>
    </div>
  );
}
