import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Play } from "lucide-react";
import { useUserProgress } from "@/hooks/use-user-progress";
import Header from "@/components/header";
import ConfidenceSlider from "@/components/confidence-slider";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [confidence, setConfidence] = useState(35);
  const [yearsExperience, setYearsExperience] = useState("");
  const [keySkills, setKeySkills] = useState("");
  
  const userId = localStorage.getItem("userId");
  const { progress, updateProgress, isUpdating } = useUserProgress(userId ? parseInt(userId) : null);

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const handleSaveBaseline = () => {
    if (!userId) return;
    
    updateProgress({
      updates: {
        currentPhase: 1,
        confidenceBaseline: confidence,
        confidenceCurrent: confidence,
        yearsExperience: parseInt(yearsExperience) || 0,
        keySkills,
      }
    });
    
    setLocation("/discovery");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="From Lost to Landing Jobs"
        subtitle="60-second explainer of your journey ahead"
        icon="▶️"
        gradientClass="gradient-purple"
      />

      <div className="page-container">
        <div className="content-section">
          <div className="header-content mb-8">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-2">From Career Confusion to Clear Direction</h2>
            <p className="text-gray-600 text-responsive-base">60-second explainer of your journey ahead</p>
          </div>

          {/* Video Placeholder */}
          <div className="component-card bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-responsive-lg font-semibold text-gray-900 mb-4">Your Journey Preview</h3>
            <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed text-responsive-base">Watch how we'll transform your career story into targeted job applications</p>
            <button className="btn-purple px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl">
              Play Video
            </button>
          </div>

          {/* Baseline Pulse */}
          <div className="component-card component-card-padding">
          <h3 className="font-semibold text-gray-900 mb-4">Let's establish your baseline</h3>
          
          <div className="space-y-4">
            <ConfidenceSlider
              value={confidence}
              onChange={setConfidence}
              label="Current confidence level"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of experience</label>
              <input
                type="number"
                placeholder="e.g., 5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key subjects/skills mastered</label>
              <textarea
                placeholder="e.g., Digital Marketing, Project Management..."
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>
          </div>

          <button
            onClick={handleSaveBaseline}
            disabled={isUpdating}
            className="w-full btn-green py-3 mt-6"
          >
            {isUpdating ? "Saving..." : "Save Baseline & Continue"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
