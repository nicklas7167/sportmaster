import HeroSection from "@/components/hero-section";
import ComparisonSection from "@/components/comparison-section";
import PredictionCard from "@/components/prediction-card";
import { useQuery } from "@tanstack/react-query";
import { Prediction } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions', { status: 'upcoming' }],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Show only top 6 predictions on homepage
  const topPredictions = predictions?.slice(0, 6);
  
  return (
    <div>
      <HeroSection />
      <ComparisonSection />
      
      {/* Featured Predictions Section */}
      <section className="bg-primary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="font-montserrat font-bold text-3xl text-white">Featured Predictions</h2>
              <p className="mt-2 text-gray-300">
                Check out our top picks for upcoming sports events
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPredictions?.map((prediction) => (
                  <PredictionCard 
                    key={prediction.id} 
                    prediction={prediction}
                  />
                ))}
                
                {topPredictions?.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    No predictions available at the moment
                  </div>
                )}
              </div>
              
              <div className="mt-10 text-center">
                <Link href="/predictions">
                  <Button 
                    className="bg-primary-800 hover:bg-primary-700 border border-primary-700 text-white inline-flex items-center"
                  >
                    View All Predictions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
