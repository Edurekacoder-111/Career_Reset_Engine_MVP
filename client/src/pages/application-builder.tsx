import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FileText, Download, Edit, Send, Mail, Check, Flame, Lock, Crown, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import PremiumModal from "@/components/premium-modal";
import WaitlistModal from "@/components/waitlist-modal";

export default function ApplicationBuilder() {
  const [, setLocation] = useLocation();
  const [saveScreenshot, setSaveScreenshot] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const userId = localStorage.getItem("userId");
  const { updateProgress, isUpdating } = useUserProgress(userId ? parseInt(userId) : null);

  const { data: roles = [] } = useQuery({
    queryKey: ["/api/roles"],
    queryFn: api.getRoles,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications", userId],
    queryFn: () => userId ? api.getUserApplications(parseInt(userId)) : [],
    enabled: !!userId,
  });

  const createApplicationMutation = useMutation({
    mutationFn: ({ roleId, method }: { roleId: number; method: string }) => {
      if (!userId) throw new Error("No user ID");
      return api.createApplication({
        userId: parseInt(userId),
        roleId,
        status: "sent",
        resumeUrl: "/resume.pdf",
        coverLetter: "Dear Hiring Manager, I am excited to apply...",
        method,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", userId] });
      toast({
        title: "Application submitted!",
        description: "Your application has been sent successfully.",
      });
    },
  });

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  // Get the top matched role for demo
  const topRole = roles.find(role => role.matchPercentage >= 90);
  const hasApplications = applications.length > 0;

  const handleEasyApply = () => {
    if (topRole) {
      createApplicationMutation.mutate({ roleId: topRole.id, method: "easyapply" });
    }
  };

  const handleEmailSubmit = () => {
    if (topRole) {
      createApplicationMutation.mutate({ roleId: topRole.id, method: "email" });
    }
  };

  const handleStartApplication2 = () => {
    updateProgress({
      updates: {
        currentPhase: 4,
      }
    });
    
    setLocation("/dashboard");
  };

  const handleJoinWaitlist = () => {
    setShowPremiumModal(false);
    setShowWaitlistModal(true);
  };

  const handleClosePremium = () => {
    setShowPremiumModal(false);
  };

  const remainingTime = "47h 23m";
  const streakProgress = hasApplications ? 50 : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Application Builder"
        subtitle="Ready to apply for your dream roles"
        icon="📄"
        phase="Phase 4 Active"
        gradientClass="gradient-green"
      />

      <div className="page-container">
        {/* Premium AI Application Builder Module */}
        <div className="mb-6 relative">
          <div className="component-card component-card-padding bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 relative overflow-hidden">
            {/* Premium Lock Overlay */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Premium AI Builder</h3>
                <p className="text-gray-600 text-sm mb-3">Unlock AI-powered application optimization</p>
                <button 
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all text-sm"
                >
                  Unlock Premium
                </button>
              </div>
            </div>
            
            {/* Background content (blurred) */}
            <div className="opacity-30">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Application Optimizer</h3>
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Automatically optimize your applications for 90%+ success rates using AI analysis</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AI Resume Optimizer</p>
                      <p className="text-xs text-gray-500">Tailored keywords & format</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Ready</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Smart Cover Letters</p>
                      <p className="text-xs text-gray-500">Company-specific messaging</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Roles */}
        <div className="mb-6">
          <h2 className="font-bold responsive-title text-gray-900 mb-4">Your Selected Roles</h2>
          
          <div className="space-y-3">
            {roles.slice(0, 2).map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-600">
                      {role.company} • {role.location} • {role.salaryRange}
                    </p>
                  </div>
                  <span className={role.matchPercentage >= 90 ? "badge-match-high" : "badge-match-medium"}>
                    {role.matchPercentage}% Match
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    role.matchPercentage >= 90 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {role.matchPercentage >= 90 ? "Ready to Apply" : "Pending"}
                  </span>
                  <button
                    disabled={role.matchPercentage < 90}
                    onClick={() => role.matchPercentage >= 90 && handleEasyApply()}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      role.matchPercentage >= 90
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {role.matchPercentage >= 90 ? "Build Application" : "Locked"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Builder */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Resume-in-a-Click</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Auto-generated from your narrative + skills</p>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-medium text-gray-900">Your Resume</h4>
                <p className="text-sm text-gray-600">Marketing Professional Resume</p>
                <p className="text-xs text-gray-500">Generated from Narrative + Skills</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
              <button className="flex items-center justify-center space-x-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                <Edit className="w-5 h-5" />
                <span>Edit Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Cover Letter</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Auto-draft for {topRole?.title || "Digital Marketing Manager"}</p>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-4">
              Dear Hiring Manager,<br /><br />
              I am excited to apply for the {topRole?.title || "Digital Marketing Manager"} position at {topRole?.company || "TechCorp Inc."}. With my background in marketing strategy and proven track record in campaign management...<br /><br />
              [Auto-generated content continues...]
            </p>
            
            <button className="flex items-center justify-center space-x-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto">
              <Edit className="w-5 h-5" />
              <span>Edit Cover Letter</span>
            </button>
          </div>
        </div>

        {/* Submit Application */}
        {topRole && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Submit Application</h3>
            <p className="text-sm text-gray-600 mb-4">Ready to send to {topRole.company}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">Resume.pdf</span>
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Cover Letter</span>
                <Check className="w-4 h-4 text-green-500" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleEasyApply}
                disabled={createApplicationMutation.isPending}
                className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex-1 ${
                  createApplicationMutation.isPending
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                <Send className="w-6 h-6" />
                <span>{createApplicationMutation.isPending ? "Sending..." : "EasyApply"}</span>
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={createApplicationMutation.isPending}
                className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-200 flex-1 ${
                  createApplicationMutation.isPending
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                }`}
              >
                <Mail className="w-6 h-6" />
                <span>Email Application</span>
              </button>
            </div>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={saveScreenshot}
                onChange={(e) => setSaveScreenshot(e.target.checked)}
              />
              <span className="text-gray-600">Save screenshot of application</span>
            </label>
          </div>
        )}

        {/* Application Log Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Application Log</h4>
          {hasApplications ? (
            <>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-blue-600">{applications.length} Submitted</span>
                <span className="text-gray-500">{applications[0]?.role?.title}</span>
              </div>
              <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                <div className="text-green-800 font-medium text-sm">{applications[0]?.role?.title}</div>
                <div className="text-green-600 text-xs">
                  {applications[0]?.role?.company} • Application submitted via {applications[0]?.method === "easyapply" ? "EasyApply" : "Email"}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Submitted</span>
                  <span className="text-green-600 text-xs">Just now</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm">No applications yet</div>
          )}
          
          {/* Dashed area for next application */}
          <div className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <span className="text-gray-400 text-lg mb-2 block">+</span>
            <p className="text-gray-500 text-sm">Ready for Application #2?</p>
          </div>
        </div>

        {/* Streak Tracker */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">Keep Your Streak!</span>
          </div>
          <p className="text-sm mb-3">Apply to 2 roles within 48 hours to unlock your achievement badge</p>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Progress</div>
              <div className="text-sm opacity-90">{applications.length}/2 Applications</div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="text-sm">{remainingTime} remaining</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div className="bg-white h-2 rounded-full" style={{ width: `${streakProgress}%` }}></div>
          </div>
        </div>

        <button
          onClick={handleStartApplication2}
          disabled={isUpdating}
          className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            isUpdating
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            {isUpdating ? "Saving..." : "Start Application #2 →"}
          </span>
        </button>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={handleClosePremium}
        onJoinWaitlist={handleJoinWaitlist}
        title="AI Application Builder Premium"
        description="Supercharge your applications with AI optimization and get 90%+ success rates."
        benefits={[
          "AI-powered resume optimization with keyword matching",
          "Smart cover letters tailored to each company",
          "Application success prediction and improvement tips"
        ]}
      />

      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        type="training"
      />
    </div>
  );
}
