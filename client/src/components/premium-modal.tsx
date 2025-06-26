import { X, Crown, Star, TrendingUp } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
  title: string;
  description: string;
  benefits: string[];
}

export default function PremiumModal({ 
  isOpen, 
  onClose, 
  onJoinWaitlist, 
  title, 
  description, 
  benefits 
}: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Premium Feature</h2>
              <p className="text-purple-100 text-sm">Unlock advanced insights</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
          
          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Premium Benefits:</span>
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onJoinWaitlist}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
            >
              Join Premium Waitlist
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue with Free Version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}