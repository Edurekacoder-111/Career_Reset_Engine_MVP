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
        icon={<Play className="w-6 h-6 text-white" />}
        gradientClass="gradient-purple"
      />

      <div className="content-container">
        <div className="text-center section-spacing">
          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Play className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-green-600" />
          </div>
          <h2 className="text-responsive-lg font-bold text-gray-900 mb-3 md:mb-4">From Lost to Landing Jobs</h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">60-second explainer of your journey ahead</p>
        </div>

        {/* Video Placeholder */}
        <div className="card-responsive bg-gray-100 text-center section-spacing max-w-lg mx-auto">
          <Play className="w-12 h-12 md:w-16 md:h-16 text-purple-600 mx-auto mb-4 md:mb-6" />
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">Watch how we'll transform your career story into real job applications</p>
          <button className="btn-mobile-friendly bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg">Play Video</button>
        </div>

        {/* Baseline Pulse */}
        <div className="bg-gray-50 rounded-lg p-6">
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
  );
}
