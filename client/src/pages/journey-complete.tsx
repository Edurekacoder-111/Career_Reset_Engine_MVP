import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Trophy, CheckCircle, Map, Send, Heart, Star, Rocket, Calendar, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Header from "@/components/header";

export default function JourneyComplete() {
  const [, setLocation] = useLocation();
  const [npsScore, setNpsScore] = useState(8);
  
  const userId = localStorage.getItem("userId");

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications", userId],
    queryFn: () => userId ? api.getUserApplications(parseInt(userId)) : [],
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const handleBackToDashboard = () => {
    setLocation("/dashboard");
  };

  const handleRestartJourney = () => {
    setLocation("/");
  };

  const journeySteps = [
    {
      title: "Narrative Crafted",
      description: "Your compelling career story is ready",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bgColor: "bg-green-50 border-green-200"
    },
    {
      title: "Skill Map Created", 
      description: "6 core skills identified & mapped",
      icon: <Map className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      title: "Applications Sent",
      description: `${applications.length} targeted applications submitted`,
      icon: <Send className="w-5 h-5 text-purple-500" />,
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      title: "Confidence Boosted",
      description: "+23% increase from baseline",
      icon: <Heart className="w-5 h-5 text-orange-500" />,
      bgColor: "bg-orange-50 border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Journey Complete!"
        subtitle="Congratulations on completing your career reset"
        icon="🏆"
        phase="Phase 6 - Wrap-Up"
        gradientClass="gradient-green"
      />

      <div className="p-4">
        {/* Journey Recap */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-gray-900">Your Journey Recap</h2>
          </div>
          
          <div className="space-y-3">
            {journeySteps.map((step, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${step.bgColor}`}>
                <div className="flex items-center space-x-3">
                  {step.icon}
                  <div>
                    <div className="font-medium text-gray-900">{step.title}</div>
                    <div className="text-sm text-gray-600">{step.description}</div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* NPS Rating */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">How likely are you to recommend CareerReset?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your feedback helps us improve</p>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-500">Not likely</span>
                <span className="text-xs text-gray-500">Extremely likely</span>
              </div>
              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    onClick={() => setNpsScore(score)}
                    className={`aspect-square text-xs font-medium border rounded transition-colors ${
                      npsScore === score
                        ? "bg-green-500 text-white border-green-500"
                        : "border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center text-sm text-green-600 font-medium">
              {npsScore >= 8 ? "Score ≥ 8 unlocks referral coupon!" : "Rate 8+ to unlock referral coupon!"}
            </div>
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Achievement Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">7</div>
              <div className="text-sm text-gray-600">Days to Complete</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">92%</div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Rocket className="w-4 h-4" />
            <span className="font-semibold">Ready for Your Next Chapter?</span>
          </div>
          <p className="text-sm mb-3">Keep applying and stay confident</p>
          <button
            onClick={handleRestartJourney}
            className="bg-white text-purple-600 px-4 py-2 rounded font-medium text-sm"
          >
            Start My Journey →
          </button>
        </div>

        <button
          onClick={handleBackToDashboard}
          className="w-full btn-green py-3"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
