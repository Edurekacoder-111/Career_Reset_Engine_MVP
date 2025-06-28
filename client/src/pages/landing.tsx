import { useState } from "react";
import { useLocation } from "wouter";
import { HelpCircle, X } from "lucide-react";
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
  const [showEmailModal, setShowEmailModal] = useState(false);
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

  const handleTimeframeClick = (option: string) => {
    if (!email.trim()) {
      setShowEmailModal(true);
      return;
    }
    setTimeframe(option);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Ready to Reset Your Career?"
        subtitle="Take our 90-second diagnostic to discover your path forward"
        icon="🚀"
        gradientClass="gradient-purple"
        onShowEmailModal={() => setShowEmailModal(true)}
      />

      <div className="page-container">
        <div className="content-section bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="form-section">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp number (optional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="form-input"
            />
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="w-full btn-purple py-4"
            >
              {createUserMutation.isPending ? "Creating Account..." : "Start My Career Reset Journey"}
            </button>
          </form>

          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            label="How confident are you about your career direction?"
          />

          <div className="component-card component-card-padding bg-white">
            <p className="font-medium mb-4 text-responsive-base text-gray-900">How long have you been preparing for a career change?</p>
            <div className="card-grid-2">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTimeframeClick(option)}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    timeframe === option
                      ? "border-purple-600 bg-purple-50 text-purple-600"
                      : "border-gray-200 hover:border-purple-600 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Validation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Please enter your email to start your new career journey!
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                We are here for you let's do it together! 🤝
              </p>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-full btn-purple py-3"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}