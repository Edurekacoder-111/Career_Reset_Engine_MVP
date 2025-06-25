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

      <div className="p-6 text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Feeling Stuck in Your Career?</h1>
        <p className="text-gray-600 mb-8">Take our 90-second diagnostic to discover your path forward</p>
        
        <div className="space-y-4 text-left">
          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            label="How confident are you about your career direction?"
          />

          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium mb-3">How long have you been preparing for a career change?</p>
            <div className="grid grid-cols-2 gap-2">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeframe(option)}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    timeframe === option
                      ? "border-purple-600 bg-purple-50 text-purple-600"
                      : "border-gray-200 hover:border-purple-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            required
          />
          <input
            type="tel"
            placeholder="WhatsApp number (optional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
          />
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="w-full btn-purple py-4"
          >
            {createUserMutation.isPending ? "Creating Account..." : "Start My Career Reset Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
