import { useState } from "react";
import { useLocation } from "wouter";
import { Rocket, Menu, X, Home, Play, Search, Target, FileText, BarChart3, Trophy, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  phase?: string;
  gradientClass?: string;
  onShowEmailModal?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  icon, 
  phase, 
  gradientClass = "gradient-purple",
  onShowEmailModal
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

  const protectedRoutes = ["/onboarding", "/discovery", "/roles", "/application"];

  const handleNavigation = (path: string) => {
    // Check if user has email for protected routes
    const userEmail = localStorage.getItem("userEmail");
    
    if (protectedRoutes.includes(path) && !userEmail && onShowEmailModal) {
      onShowEmailModal();
      setIsMenuOpen(false);
      return;
    }
    
    setLocation(path);
    setIsMenuOpen(false);
  };



  return (
    <>
      <div className={`${gradientClass} header-professional p-4 md:p-6 lg:p-8 text-white relative z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="flex items-center justify-center w-full h-full">
                  <Rocket className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
              <span className="font-semibold text-lg md:text-xl">CareerReset</span>
            </div>
            {/* Mobile hamburger menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:p-3 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.slice(0, 5).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === item.path
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Professional Left-Aligned Content */}
          <div className="mt-6 md:mt-8 flex items-start space-x-4 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="header-icon-container">
                <span className="text-xl md:text-2xl">{icon || "🚀"}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h1 className="header-title">{title}</h1>
                {phase && (
                  <span className="header-phase-badge">
                    {phase}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="header-subtitle">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 right-0 w-80 nav-menu-overlay max-w-full h-full bg-white shadow-xl">
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
                    className={`w-full flex items-center justify-between p-3 nav-menu-item rounded-lg text-left transition-colors ${
                      location === item.path
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{item.label}</span>
                        </div>
                        <div className="text-sm text-gray-500">{item.phase}</div>
                      </div>
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
