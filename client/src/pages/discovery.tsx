import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Bot, Wand2, Clock } from "lucide-react";
import { useUserProgress } from "@/hooks/use-user-progress";
import Header from "@/components/header";
import WaitlistModal from "@/components/waitlist-modal";

export default function Discovery() {
  const [, setLocation] = useLocation();
  const [education, setEducation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [coreSkills, setCoreSkills] = useState<string[]>([]);
  const [showNarrative, setShowNarrative] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const { updateProgress, isUpdating } = useUserProgress(userId ? parseInt(userId) : null);

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const achievementOptions = [
    { id: "campaign", title: "Led Digital Campaign", description: "Increased brand engagement by 45% across social platforms" },
    { id: "team", title: "Team Management", description: "Managed cross-functional team of 8 members" },
    { id: "revenue", title: "Revenue Growth", description: "Contributed to 30% revenue increase in Q3" },
  ];

  const skillOptions = [
    "Digital Marketing", "Data Analytics", "Project Management", 
    "Content Strategy", "SEO/SEM", "Brand Management"
  ];

  const skillGaps = [
    { name: "Policy Analytics", percentage: 40, color: "red" },
    { name: "Advanced Excel", percentage: 65, color: "yellow" },
    { name: "Team Leadership", percentage: 85, color: "green" },
  ];

  const toggleAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.includes(achievementId) 
        ? prev.filter(id => id !== achievementId)
        : [...prev, achievementId]
    );
  };

  const toggleCoreSkill = (skill: string) => {
    setCoreSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else if (prev.length < 3) {
        return [...prev, skill];
      }
      return prev;
    });
  };

  const generateNarrative = () => {
    setShowNarrative(true);
  };

  const handleContinue = () => {
    if (!userId) return;
    
    updateProgress({
      updates: {
        currentPhase: 2,
        narrative: "A marketing professional with 5+ years experience in digital campaigns and brand strategy. Proven track record in increasing engagement rates by 40% and managing cross-functional teams...",
        achievements: achievementOptions.filter(a => achievements.includes(a.id)),
        coreSkills,
        storyScore: 72,
      }
    });
    
    setLocation("/roles");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Discovery Sprint"
        subtitle="Let's build your career story"
        icon={<Search className="w-6 h-6 text-white" />}
        phase="Day 1 Unlocked"
        gradientClass="gradient-green"
      />

      <div className="p-4">
        {/* AI Questionnaire */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Questionnaire</h3>
              <p className="text-sm text-gray-600">Pre-filling your background</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">What's your educational background?</label>
              <textarea
                placeholder="Tell us about your education, certifications, or training..."
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Describe your work experience</label>
              <textarea
                placeholder="Share your roles, responsibilities, and key projects..."
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            <button
              onClick={generateNarrative}
              className="w-full btn-purple py-3 flex items-center justify-center space-x-2"
            >
              <span>Generate Draft Narrative</span>
              <Wand2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draft Narrative */}
        {showNarrative && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Draft Narrative v0</h3>
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">AI Generated</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              "A marketing professional with 5+ years experience in digital campaigns and brand strategy. Proven track record in increasing engagement rates by 40% and managing cross-functional teams..."
            </p>
            <button className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg font-medium flex items-center justify-center space-x-2">
              <span>Edit Your Story</span>
            </button>
            
            {/* Smart Nudge */}
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700">Smart nudge in 12h if idle</span>
            </div>
          </div>
        )}

        {/* Top 3 Achievements */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Select Your Top 3 Achievements</h3>
          <div className="space-y-3">
            {achievementOptions.map((achievement) => (
              <label
                key={achievement.id}
                className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  achievements.includes(achievement.id)
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={achievements.includes(achievement.id)}
                  onChange={() => toggleAchievement(achievement.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Skill-Map Wizard */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Wand2 className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold text-gray-900">Skill-Map Wizard</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Drag 3 skills to your core stack</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Market Skills (GPT Suggested)</h4>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleCoreSkill(skill)}
                  className={`p-3 rounded-lg text-center text-sm transition-colors ${
                    coreSkills.includes(skill)
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={!coreSkills.includes(skill) && coreSkills.length >= 3}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
            <h4 className="font-medium text-purple-700 mb-2">Your Core Stack</h4>
            <p className="text-sm text-gray-600 mb-2">Select skills above (3 max)</p>
            <div className="grid grid-cols-1 gap-2">
              {coreSkills.map((skill) => (
                <div key={skill} className="p-2 bg-purple-600 text-white rounded text-center text-sm">
                  {skill}
                </div>
              ))}
              {coreSkills.length === 0 && (
                <div className="p-2 text-gray-500 text-center text-sm">No skills selected</div>
              )}
            </div>
          </div>
        </div>

        {/* Skill-Gap Badges */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Skill-Gap Badges</h3>
          <div className="space-y-3">
            {skillGaps.map((gap) => (
              <div
                key={gap.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  gap.color === "red" ? "bg-red-50 border-red-200" :
                  gap.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                  "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    gap.color === "red" ? "bg-red-500" :
                    gap.color === "yellow" ? "bg-yellow-500" :
                    "bg-green-500"
                  }`} />
                  <span className="font-medium text-gray-900">{gap.name}</span>
                </div>
                <span className={`font-semibold ${
                  gap.color === "red" ? "text-red-600" :
                  gap.color === "yellow" ? "text-yellow-600" :
                  "text-green-600"
                }`}>
                  {gap.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Story Clarity Score */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">72</span>
          </div>
          <h3 className="font-semibold text-gray-900">Story Clarity Score</h3>
          <p className="text-sm text-gray-600 mb-4">Good progress! Let's get to 85+</p>
          
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Background captured</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-1">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700">Achievements selected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">Core skills pending</span>
            </div>
          </div>
        </div>

        {/* Training Track Teaser */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg p-4 text-white mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">Training Track Preview</span>
          </div>
          <p className="text-sm mb-3">"Close your Skill-Gap Badges with curated micro-projects."</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Policy Analytics</div>
              <div className="text-sm opacity-90">3 projects</div>
            </div>
            <button
              onClick={() => setShowTrainingModal(true)}
              className="bg-white text-orange-500 px-4 py-2 rounded font-medium text-sm"
            >
              Complete Discovery First
            </button>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={isUpdating}
          className="w-full btn-purple py-3"
        >
          {isUpdating ? "Saving..." : "Continue Discovery →"}
        </button>
      </div>

      <WaitlistModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        type="training"
      />
    </div>
  );
}
