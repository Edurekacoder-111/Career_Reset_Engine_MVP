import { Rocket, Menu } from "lucide-react";

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
  return (
    <div className={`${gradientClass} p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-semibold text-lg">CareerReset</span>
        </div>
        <button className="p-2">
          <Menu className="w-5 h-5" />
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
  );
}
