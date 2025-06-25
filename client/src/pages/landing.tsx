import { useState } from "react";
import { useLocation } from "wouter";
import { HelpCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ConfidenceSlider from "@/components/confidence-slider";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confidence, setConfidence] = useState(30);
  const [timeframe, setTimeframe] = useState("1-6 months");
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: () => api.createUser({ email, whatsapp: whatsapp || undefined }),
    onSuccess: (user) => {
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("userEmail", user.email);
      setLocation("/onboarding");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      createUserMutation.mutate();
    }
  };

  const timeframeOptions = [
    "Less than 1 month",
    "1-6 months", 
    "6+ months",
    "Over a year"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Feeling Stuck in Your Career?"
        subtitle=""
        icon={<HelpCircle className="w-6 h-6 text-white" />}
        gradientClass="gradient-purple"
      />

      <div className="content-container text-center">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <HelpCircle className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-purple-600" />
        </div>
        <h1 className="text-responsive-lg font-bold text-gray-900 mb-4 md:mb-6">Feeling Stuck in Your Career?</h1>
        <p className="text-gray-600 mb-8 md:mb-12 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">Take our 90-second diagnostic to discover your path forward</p>
        
        <div className="space-y-6 md:space-y-8 text-left max-w-lg mx-auto">
          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            label="How confident are you about your career direction?"
          />

          <div className="card-responsive">
            <p className="font-semibold mb-4 md:mb-6 text-responsive-md">How long have you been preparing for a career change?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeframe(option)}
                  className={`btn-mobile-friendly text-sm md:text-base rounded-xl border-2 transition-all duration-200 ${
                    timeframe === option
                      ? "border-purple-600 bg-purple-50 text-purple-600 shadow-md"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 md:mt-12 form-responsive max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input mb-4"
            required
          />
          <input
            type="tel"
            placeholder="WhatsApp number (optional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="form-input mb-6"
          />
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white btn-large rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {createUserMutation.isPending ? "Creating Account..." : "Start My Career Reset Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
