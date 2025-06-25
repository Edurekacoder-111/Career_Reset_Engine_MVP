import { useState } from "react";
import { X, GraduationCap, UserRoundCheck, Lock, Bell, Code, Award, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "training" | "mentor";
}

export default function WaitlistModal({ isOpen, onClose, type }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const waitlistMutation = useMutation({
    mutationFn: () => api.addToWaitlist(email, type),
    onSuccess: () => {
      toast({
        title: "Added to waitlist!",
        description: "We'll notify you when this feature becomes available.",
      });
      setEmail("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      waitlistMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {type === "training" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Training Track</span>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Waitlist</span>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2">Improve your skills and get placed!</h3>
            
            <div className="space-y-4 my-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Skill-Gap Micro-Projects</div>
                  <div className="text-xs text-gray-600">Close your skill gaps with curated projects</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Industry Certifications</div>
                  <div className="text-xs text-gray-600">Earn recognized credentials</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">1-on-1 Mentorship</div>
                  <div className="text-xs text-gray-600">Get personalized guidance</div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                required
              />
              <button
                type="submit"
                disabled={waitlistMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-lg font-semibold"
              >
                {waitlistMutation.isPending ? "Adding..." : "Join Waitlist for Updates"}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">Be the first to know when we launch!</p>
            </form>
            
            <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-purple-600 font-bold text-lg">85%</div>
                <div className="text-xs text-gray-600">Profile Strength</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-bold text-lg">92%</div>
                <div className="text-xs text-gray-600">Avg Match Score</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mentor Feedback</h3>
              <p className="text-sm text-gray-600 mb-1">Waitlist Only</p>
              
              <div className="my-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserRoundCheck className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Expert Career Guidance</h4>
                <p className="text-sm text-gray-600">Connect with industry mentors for personalized feedback on your career transition</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={waitlistMutation.isPending}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <span>{waitlistMutation.isPending ? "Adding..." : "Join Waitlist"}</span>
                  <Bell className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 mt-3">We'll notify you when mentor sessions become available</p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
