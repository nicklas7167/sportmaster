import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function ComparisonSection() {
  const { user } = useAuth();
  
  return (
    <section className="bg-primary-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl text-white">Free vs Premium Benefits</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            See why thousands of bettors have upgraded to our premium predictions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="bg-primary-900 border-primary-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-bold text-xl text-white">Free Plan</h3>
                <span className="px-4 py-1 bg-gray-700 text-white rounded-full text-sm font-medium">$0/month</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>Access to all free predictions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>Standard match information</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>Basic filtering options</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <X className="h-6 w-6 text-gray-600 mr-3 flex-shrink-0" />
                  <span>No high-value predictions</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <X className="h-6 w-6 text-gray-600 mr-3 flex-shrink-0" />
                  <span>No expert analysis</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/predictions">
                  <Button 
                    className="w-full bg-primary-700 hover:bg-primary-600 text-white"
                  >
                    View Free Predictions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-primary-800 to-primary-900 border-2 border-accent-500 shadow-lg shadow-accent-500/10 relative overflow-visible mt-3">
            <CardContent className="p-6">
              <div className="premium-badge" style={{fontSize: '0.875rem'}}>
                RECOMMENDED
              </div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-bold text-xl text-white">Premium Plan</h3>
                <span className="px-4 py-1 bg-accent-400 text-primary-900 rounded-full text-sm font-bold">$29.99/month</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>All free predictions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span><strong>Access to exclusive premium predictions</strong></span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>High-value odds selections</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>Advanced filters and sorting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-accent-400 mr-3 flex-shrink-0" />
                  <span>Expert analysis with each prediction</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href={user ? "/profile" : "/auth"}>
                  <Button 
                    className="w-full bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold"
                  >
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
