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
  const [customAchievements, setCustomAchievements] = useState<string[]>(["", "", ""]);
  const [achievementMode, setAchievementMode] = useState<"select" | "custom">("select");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "professional" | "academic" | "personal">("all");
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
    // Professional achievements
    { id: "campaign", title: "Led Digital Campaign", description: "Increased brand engagement by 45% across social platforms", category: "professional" },
    { id: "team", title: "Team Management", description: "Managed cross-functional team of 8 members", category: "professional" },
    { id: "revenue", title: "Revenue Growth", description: "Contributed to 30% revenue increase in Q3", category: "professional" },
    { id: "process", title: "Process Improvement", description: "Streamlined workflows reducing task completion time by 25%", category: "professional" },
    { id: "client", title: "Client Relations", description: "Maintained 95% client satisfaction rate over 2 years", category: "professional" },
    
    // Academic/Educational achievements
    { id: "academic_honor", title: "Academic Excellence", description: "Graduated with honors or maintained high GPA", category: "academic" },
    { id: "research", title: "Research Project", description: "Completed significant research or thesis project", category: "academic" },
    { id: "leadership_school", title: "Student Leadership", description: "Led student organizations or academic initiatives", category: "academic" },
    { id: "scholarship", title: "Scholarship/Award", description: "Received academic scholarships or recognition", category: "academic" },
    
    // Personal/Volunteer achievements
    { id: "volunteer", title: "Volunteer Work", description: "Organized community events or charity initiatives", category: "personal" },
    { id: "personal_project", title: "Personal Project", description: "Built something meaningful in your spare time", category: "personal" },
    { id: "skill_cert", title: "Skill Certification", description: "Earned professional certifications or completed courses", category: "personal" },
    { id: "creative", title: "Creative Achievement", description: "Won competitions, published work, or creative recognition", category: "personal" },
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
    setAchievements(prev => {
      if (prev.includes(achievementId)) {
        return prev.filter(id => id !== achievementId);
      } else if (prev.length < 3) {
        return [...prev, achievementId];
      }
      return prev;
    });
  };

  const updateCustomAchievement = (index: number, value: string) => {
    setCustomAchievements(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === "all") return achievementOptions;
    return achievementOptions.filter(achievement => achievement.category === selectedCategory);
  };

  const getSelectedAchievementsCount = () => {
    if (achievementMode === "custom") {
      return customAchievements.filter(achievement => achievement.trim() !== "").length;
    }
    return achievements.length;
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
    
    // Prepare achievements data based on current mode
    const achievementsData = achievementMode === "custom" 
      ? customAchievements.filter(a => a.trim() !== "").map((achievement, index) => ({
          id: `custom_${index}`,
          title: `Achievement ${index + 1}`,
          description: achievement,
          category: "custom"
        }))
      : achievementOptions.filter(a => achievements.includes(a.id));

    // Check if user has at least one achievement
    const hasAchievements = achievementsData.length > 0;
    
    if (!hasAchievements) {
      alert("Please select or write at least one achievement before continuing.");
      return;
    }
    
    updateProgress({
      updates: {
        currentPhase: 2,
        narrative: "A professional with diverse experiences and proven achievements. Demonstrated ability to deliver results and contribute meaningfully across different contexts...",
        achievements: achievementsData,
        coreSkills,
        storyScore: Math.min(72 + (achievementsData.length * 5), 95),
      }
    });
    
    setLocation("/roles");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Discovery Sprint"
        subtitle="Let's build your career story"
        icon="🔍"
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Select Your Top 3 Achievements</h3>
            <div className="text-sm text-purple-600 font-medium">
              {getSelectedAchievementsCount()}/3 selected
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => setAchievementMode("select")}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                achievementMode === "select"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Choose from Examples
            </button>
            <button
              onClick={() => setAchievementMode("custom")}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                achievementMode === "custom"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Write Your Own
            </button>
          </div>

          {achievementMode === "select" ? (
            <div>
              {/* Category Filter */}
              <div className="flex space-x-2 mb-4 overflow-x-auto">
                {[
                  { key: "all", label: "All" },
                  { key: "professional", label: "Work" },
                  { key: "academic", label: "School" },
                  { key: "personal", label: "Personal" }
                ].map(category => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.key
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Achievement Options */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {getFilteredAchievements().map((achievement) => (
                  <label
                    key={achievement.id}
                    className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      achievements.includes(achievement.id)
                        ? "border-purple-600 bg-purple-50 shadow-sm"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    } ${achievements.length >= 3 && !achievements.includes(achievement.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={achievements.includes(achievement.id)}
                      onChange={() => toggleAchievement(achievement.id)}
                      className="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      disabled={achievements.length >= 3 && !achievements.includes(achievement.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{achievement.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{achievement.description}</div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        achievement.category === "professional" ? "bg-blue-100 text-blue-700" :
                        achievement.category === "academic" ? "bg-green-100 text-green-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {achievement.category}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Write about your achievements, experiences, or things you're proud of. These can be from work, school, personal projects, or life experiences.
              </p>
              
              {customAchievements.map((achievement, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievement {index + 1} {index === 0 ? "(Required)" : "(Optional)"}
                  </label>
                  <textarea
                    value={achievement}
                    onChange={(e) => updateCustomAchievement(index, e.target.value)}
                    placeholder={
                      index === 0 ? "e.g., Completed my degree while working part-time..." :
                      index === 1 ? "e.g., Organized a successful fundraiser for local charity..." :
                      "e.g., Built a personal website to showcase my work..."
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {achievement.length}/200 characters
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Focus on results and impact. What did you accomplish? How did it help others or improve a situation?
                </p>
              </div>
            </div>
          )}
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
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-6 text-lg">Skill-Gap Badges</h3>
          <div className="space-y-4">
            {skillGaps.map((gap) => (
              <div
                key={gap.name}
                className={`flex items-center justify-between p-4 md:p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                  gap.color === "red" ? "bg-red-50 border-red-200" :
                  gap.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                  "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                    gap.color === "red" ? "bg-red-500" :
                    gap.color === "yellow" ? "bg-yellow-500" :
                    "bg-green-500"
                  }`} />
                  <span className="font-semibold text-gray-900 text-base md:text-lg">{gap.name}</span>
                </div>
                <span className={`font-bold text-xl md:text-2xl ${
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
        <div className="text-center mb-8 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">72</span>
          </div>
          <h3 className="font-bold text-gray-900 text-xl md:text-2xl mb-3">Story Clarity Score</h3>
          <p className="text-base md:text-lg text-gray-600 mb-6">Good progress! Let's get to 85+</p>
          
          <div className="text-left bg-gray-50 rounded-xl p-5 md:p-6 space-y-3">
            <div className="flex items-center space-x-3 text-base md:text-lg">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm md:text-base">✓</span>
              </div>
              <span className="text-gray-700 font-medium">Background captured</span>
            </div>
            <div className="flex items-center space-x-3 text-base md:text-lg">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm md:text-base">✓</span>
              </div>
              <span className="text-gray-700 font-medium">Achievements selected</span>
            </div>
            <div className="flex items-center space-x-3 text-base md:text-lg">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Core skills pending</span>
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
