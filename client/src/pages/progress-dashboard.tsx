import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { BarChart3, Columns, Heart, Flame, Clock, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUserProgress } from "@/hooks/use-user-progress";
import Header from "@/components/header";
import WaitlistModal from "@/components/waitlist-modal";

export default function ProgressDashboard() {
  const [, setLocation] = useLocation();
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const { progress, updateProgress, isUpdating } = useUserProgress(userId ? parseInt(userId) : null);

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications", userId],
    queryFn: () => userId ? api.getUserApplications(parseInt(userId)) : [],
    enabled: !!userId,
  });

  const { data: confidenceHistory = [] } = useQuery({
    queryKey: ["/api/confidence", userId],
    queryFn: () => userId ? api.getUserConfidenceHistory(parseInt(userId)) : [],
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const handleContinueJourney = () => {
    updateProgress({
      updates: {
        currentPhase: 5,
      }
    });
    
    setLocation("/complete");
  };

  // Organize applications by status for Kanban
  const sentApps = applications.filter(app => app.status === "sent");
  const viewedApps = applications.filter(app => app.status === "viewed");
  const interviewApps = applications.filter(app => app.status === "interview");

  // Current confidence level
  const currentConfidence = progress?.confidenceCurrent || 78;
  const baselineConfidence = progress?.confidenceBaseline || 35;
  const confidenceGain = currentConfidence - baselineConfidence;

  // Weekly progress
  const weeklyApplications = applications.length;
  const targetApplications = 5;
  const daysRemaining = 2;

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Progress Dashboard"
        subtitle="Track your application journey"
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        phase="Phase 5 Active"
        gradientClass="gradient-purple"
      />

      <div className="p-4">
        {/* Application Pipeline (Kanban) */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Columns className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">Application Pipeline</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Sent Column */}
            <div className="kanban-column kanban-sent">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-blue-900 text-sm">Sent</span>
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {sentApps.length} apps
                </span>
              </div>
              <div className="space-y-2">
                {sentApps.map((app) => (
                  <div key={app.id} className="kanban-card">
                    <div className="font-medium text-xs">{app.role.title.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="text-xs text-gray-600">{app.role.company}</div>
                  </div>
                ))}
                {sentApps.length === 0 && (
                  <div className="text-center py-4 text-xs text-gray-500">No applications sent yet</div>
                )}
              </div>
            </div>

            {/* Viewed Column */}
            <div className="kanban-column kanban-viewed">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-yellow-900 text-sm">Viewed</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  {viewedApps.length} apps
                </span>
              </div>
              <div className="space-y-2">
                {viewedApps.map((app) => (
                  <div key={app.id} className="kanban-card">
                    <div className="font-medium text-xs">{app.role.title.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="text-xs text-gray-600">{app.role.company}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-yellow-600">Keep improving!</span>
                    </div>
                  </div>
                ))}
                {viewedApps.length === 0 && (
                  <div className="text-center py-4 text-xs text-gray-500">No viewed applications</div>
                )}
              </div>
            </div>

            {/* Interview Column */}
            <div className="kanban-column kanban-interview">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-green-900 text-sm">Interview</span>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                  {interviewApps.length} apps
                </span>
              </div>
              <div className="space-y-2">
                {interviewApps.map((app) => (
                  <div key={app.id} className="kanban-card">
                    <div className="font-medium text-xs">{app.role.title.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="text-xs text-gray-600">{app.role.company}</div>
                  </div>
                ))}
                {interviewApps.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-green-300 text-2xl mb-2">🏆</div>
                    <p className="text-xs text-green-600">Your first interview will appear here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Graph */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Confidence Graph</h3>
            </div>
            <button className="btn-purple px-3 py-2 text-sm">Take Pulse</button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Current Level</span>
              <span className="font-semibold text-purple-600">{currentConfidence}%</span>
            </div>
            <div className="progress-bar h-3 mb-3">
              <div className="progress-fill" style={{ width: `${currentConfidence}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>vs Baseline</span>
              <span className="text-green-600 font-medium">↗ +{confidenceGain}%</span>
            </div>
            
            {/* Simple confidence trend */}
            <div className="flex justify-between items-end space-x-2 h-16 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-2 bg-gray-300 rounded-t" style={{ height: "30%" }}></div>
                <span className="text-xs text-gray-500 mt-1">Day 1</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: "50%" }}></div>
                <span className="text-xs text-gray-500 mt-1">Day 4</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 bg-purple-600 rounded-t" style={{ height: "75%" }}></div>
                <span className="text-xs text-gray-500 mt-1">Day 7</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 bg-purple-600 rounded-t" style={{ height: "78%" }}></div>
                <span className="text-xs text-purple-600 mt-1">Today</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 bg-gray-200 rounded-t" style={{ height: "20%" }}></div>
                <span className="text-xs text-gray-400 mt-1">Next</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Next pulse check in 2 days</span>
            </div>
          </div>
        </div>

        {/* Stay Active Challenge */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-4 text-white mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">Stay Active!</span>
          </div>
          <p className="text-sm mb-3">Keep your momentum going</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Applications this week</span>
              <span className="font-semibold">{weeklyApplications}/{targetApplications}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{targetApplications - weeklyApplications} more to unlock finish-challenge coupon</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">⏰ {daysRemaining} days remaining</span>
              <button className="bg-white text-orange-500 px-2 py-1 rounded text-xs ml-auto">
                View Reward
              </button>
            </div>
          </div>
        </div>

        {/* Training Track Panel */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-gray-900">Training Track Panel</span>
                <span className="text-gray-400 text-sm">🔒</span>
              </div>
              <p className="text-sm text-gray-600">Improve your skills and get placed!</p>
            </div>
          </div>
          <button
            onClick={() => setShowTrainingModal(true)}
            className="w-full border border-orange-500 text-orange-500 py-2 rounded font-medium text-sm"
          >
            Waitlist
          </button>
        </div>

        <button
          onClick={handleContinueJourney}
          disabled={isUpdating}
          className="w-full btn-green py-3"
        >
          {isUpdating ? "Saving..." : "Continue Your Journey →"}
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
