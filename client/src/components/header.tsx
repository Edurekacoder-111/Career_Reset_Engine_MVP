import { useState } from "react";
import { useLocation } from "wouter";
import { Rocket, Menu, X, Home, Play, Search, Target, FileText, BarChart3, Trophy, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  phase?: string;
  gradientClass?: string;
}

export default function Header({ 
  title, 
  subtitle, 
  icon, 
  phase, 
  gradientClass = "gradient-purple" 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const menuItems = [
    { path: "/", label: "Landing Page", icon: <Home className="w-5 h-5" />, phase: "Phase 0" },
    { path: "/onboarding", label: "Onboarding", icon: <Play className="w-5 h-5" />, phase: "Phase 1" },
    { path: "/discovery", label: "Discovery Sprint", icon: <Search className="w-5 h-5" />, phase: "Phase 2" },
    { path: "/roles", label: "Role Matching", icon: <Target className="w-5 h-5" />, phase: "Phase 3" },
    { path: "/application", label: "Application Builder", icon: <FileText className="w-5 h-5" />, phase: "Phase 4" },
    { path: "/dashboard", label: "Progress Dashboard", icon: <BarChart3 className="w-5 h-5" />, phase: "Phase 5" },
    { path: "/complete", label: "Journey Complete", icon: <Trophy className="w-5 h-5" />, phase: "Phase 6" },
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={`${gradientClass} p-4 text-white relative z-40`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-lg">CareerReset</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="mt-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            {icon}
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-white/90">{subtitle}</p>
          {phase && (
            <div className="mt-2 text-sm bg-white/20 px-3 py-1 rounded-full inline-block">
              {phase}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">CareerReset</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      location === item.path
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.phase}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Journey Progress</span>
                  </div>
                  <p className="text-sm text-purple-700">Navigate through your 6-phase career transformation journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
