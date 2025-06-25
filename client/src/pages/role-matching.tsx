import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Bookmark, Lightbulb, GraduationCap, UserRoundCheck, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUserProgress } from "@/hooks/use-user-progress";
import Header from "@/components/header";
import WaitlistModal from "@/components/waitlist-modal";

export default function RoleMatching() {
  const [, setLocation] = useLocation();
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const { updateProgress, isUpdating } = useUserProgress(userId ? parseInt(userId) : null);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["/api/roles"],
    queryFn: api.getRoles,
  });

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const handleCompleteSelection = () => {
    if (!userId) return;
    
    updateProgress({
      updates: {
        currentPhase: 3,
      }
    });
    
    setLocation("/application");
  };

  const getMatchBadgeClass = (percentage: number) => {
    if (percentage >= 90) return "badge-match-high";
    if (percentage >= 80) return "badge-match-medium";
    return "badge-match-low";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string, matchPercentage: number) => {
    if (status === "available" && matchPercentage >= 90) return "Ready to Apply";
    if (status === "available") return "Build Application";
    if (status === "pending") return "Pending";
    return "Locked";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Role Matching"
        subtitle="AI-powered job recommendations"
        icon={<Search className="w-6 h-6 text-white" />}
        gradientClass="gradient-blue-purple"
      />

      <div className="p-4">
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Matched Roles for You</h2>
          
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="role-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-600">
                      {role.company} • {role.location} • {role.salaryRange}
                    </p>
                  </div>
                  <span className={getMatchBadgeClass(role.matchPercentage)}>
                    {role.matchPercentage}% Match
                  </span>
                </div>
                <div className="flex space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(role.status)}`}>
                    {getStatusText(role.status, role.matchPercentage)}
                  </span>
                  {role.matchPercentage >= 90 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      Build Application
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  {role.matchPercentage >= 90 && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Bookmark className="w-4 h-4" />
                      <span>Shortlisted</span>
                    </div>
                  )}
                  <button className="text-purple-600 text-sm font-medium ml-auto">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Nudge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-900">2 new roles spotted!</span>
          </div>
          <p className="text-sm text-blue-700">Check back tomorrow for fresh matches based on your profile.</p>
        </div>

        {/* Training Track Promo */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg p-4 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="font-semibold">Training Track</span>
                <Lock className="w-3 h-3" />
              </div>
              <p className="text-sm">Improve your match scores with targeted skills training</p>
            </div>
            <button
              onClick={() => setShowTrainingModal(true)}
              className="bg-white text-orange-500 px-3 py-2 rounded font-medium text-sm"
            >
              Wait-List
            </button>
          </div>
        </div>

        {/* Mentor Feedback Promo */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <UserRoundCheck className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">Mentor Feedback</span>
                <Lock className="w-3 h-3 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">Get expert feedback on your profile and applications</p>
            </div>
            <button
              onClick={() => setShowMentorModal(true)}
              className="border border-gray-300 text-gray-700 px-3 py-2 rounded font-medium text-sm"
            >
              Waitlist
            </button>
          </div>
        </div>

        <button
          onClick={handleCompleteSelection}
          disabled={isUpdating}
          className="w-full btn-green py-3"
        >
          {isUpdating ? "Saving..." : "Complete Role Selection →"}
        </button>
      </div>

      <WaitlistModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        type="training"
      />

      <WaitlistModal
        isOpen={showMentorModal}
        onClose={() => setShowMentorModal(false)}
        type="mentor"
      />
    </div>
  );
}
