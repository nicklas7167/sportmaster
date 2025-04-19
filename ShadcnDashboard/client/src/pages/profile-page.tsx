import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import StatusBadge from "@/components/status-badge";
import { useQuery } from "@tanstack/react-query";
import { Prediction } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user, isPremium, upgradeToPremiumMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");
  
  // Get user's recent predictions view history (placeholder for now)
  const { data: recentPredictions } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions', { limit: 3 }],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // For a real application, you would implement this to fetch from user's history
  
  const getSubscriptionEndDate = () => {
    if (user?.subscriptionEnd) {
      return format(new Date(user.subscriptionEnd), "MMMM d, yyyy");
    }
    return "N/A";
  };
  
  const handleUpgradeToPremium = () => {
    upgradeToPremiumMutation.mutate();
  };
  
  return (
    <section className="bg-primary-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <Card className="bg-primary-800">
              <div className="p-5 border-b border-primary-700">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-accent-500 flex items-center justify-center text-primary-900 font-bold text-xl">
                    {user?.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{user?.username}</h3>
                    <p className="text-gray-400 text-sm">
                      Member since {user?.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : ""}
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("subscription")}
                      className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "subscription" 
                          ? "bg-primary-700 text-white" 
                          : "text-gray-300 hover:bg-primary-700 hover:text-white"
                      }`}
                    >
                      My Subscription
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("account")}
                      className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "account" 
                          ? "bg-primary-700 text-white" 
                          : "text-gray-300 hover:bg-primary-700 hover:text-white"
                      }`}
                    >
                      Account Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "history" 
                          ? "bg-primary-700 text-white" 
                          : "text-gray-300 hover:bg-primary-700 hover:text-white"
                      }`}
                    >
                      Prediction History
                    </button>
                  </li>
                </ul>
              </nav>
            </Card>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <Card className="bg-primary-800">
              <CardHeader className="border-b border-primary-700">
                <CardTitle className="font-montserrat font-bold text-2xl text-white">
                  {activeTab === "subscription" && "My Subscription"}
                  {activeTab === "account" && "Account Settings"}
                  {activeTab === "history" && "Prediction History"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {activeTab === "subscription" && (
                  <>
                    {/* Current Subscription */}
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 p-6 rounded-lg border border-accent-500 mb-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {isPremium ? "Premium Subscription" : "Free Account"}
                          </h3>
                          {isPremium && (
                            <p className="text-gray-300 mt-1">
                              Your subscription renews on <span className="text-white">{getSubscriptionEndDate()}</span>
                            </p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className={`px-4 py-1 rounded-full font-medium ${
                            isPremium 
                              ? "bg-accent-500 text-primary-900" 
                              : "bg-gray-700 text-white"
                          }`}>
                            {isPremium ? "Active" : "Free Tier"}
                          </span>
                        </div>
                      </div>
                      
                      {isPremium ? (
                        <>
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-primary-900/50 p-4 rounded">
                              <div className="text-sm text-gray-400 mb-1">Billing Cycle</div>
                              <div className="text-white">Monthly</div>
                            </div>
                            <div className="bg-primary-900/50 p-4 rounded">
                              <div className="text-sm text-gray-400 mb-1">Price</div>
                              <div className="text-white">$29.99/month</div>
                            </div>
                            <div className="bg-primary-900/50 p-4 rounded">
                              <div className="text-sm text-gray-400 mb-1">Next Billing</div>
                              <div className="text-white">{getSubscriptionEndDate()}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
                            <Button className="bg-primary-900 hover:bg-primary-700 text-white mb-3 sm:mb-0">
                              Update Payment Method
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              Cancel Subscription
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="mb-6">
                          <p className="text-gray-300 mb-4">
                            Upgrade to Premium to unlock all our expert predictions and exclusive features.
                          </p>
                          <Button 
                            className="bg-accent-500 hover:bg-accent-400 text-primary-900 font-semibold"
                            onClick={handleUpgradeToPremium}
                            disabled={upgradeToPremiumMutation.isPending}
                          >
                            {upgradeToPremiumMutation.isPending ? "Processing..." : "Upgrade to Premium"}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Subscription Benefits */}
                    <div className="mb-8">
                      <h3 className="font-montserrat font-semibold text-xl text-white mb-4">
                        {isPremium ? "Your Premium Benefits" : "Premium Benefits"}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                          <span>Access to exclusive premium predictions</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                          <span>High-value selections with detailed analysis</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                          <span>Advanced filtering and sorting options</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                          <span>Expert insights from our professional analysts</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
                
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <p className="text-gray-300 mb-4">
                      Manage your account settings and preferences below.
                    </p>
                    
                    <div className="bg-primary-900 p-6 rounded-lg">
                      <h3 className="text-white font-medium text-lg mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Username</label>
                          <div className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white">
                            {user?.username}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                          <div className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white">
                            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} User
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                          <div className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white">
                            {user?.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-primary-900 p-6 rounded-lg">
                      <h3 className="text-white font-medium text-lg mb-4">Security</h3>
                      <Button className="bg-primary-800 hover:bg-primary-700 text-white">
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
                
                {activeTab === "history" && (
                  <div>
                    <h3 className="font-montserrat font-semibold text-xl text-white mb-4">Recently Viewed Predictions</h3>
                    
                    <div className="space-y-4">
                      {recentPredictions?.slice(0, 3).map((prediction) => (
                        <div key={prediction.id} className="bg-primary-900 p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-400">{prediction.league}</div>
                            <div className="text-white font-medium">{prediction.matchTitle}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {format(new Date(prediction.startTime), "MMM d, HH:mm")}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <StatusBadge status={prediction.status} className="mb-2" />
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              prediction.type === "premium" 
                                ? "bg-accent-500 text-primary-900" 
                                : "bg-gray-700 text-white"
                            }`}>
                              {prediction.type}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {recentPredictions?.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          No prediction history available
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Link href="/predictions">
                        <a className="text-accent-400 hover:text-accent-500 inline-flex items-center font-medium">
                          View All Predictions
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                          </svg>
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
