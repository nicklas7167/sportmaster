import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Prediction } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import PredictionCard from "@/components/prediction-card";
import PredictionFilters from "@/components/prediction-filters";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function PredictionsPage() {
  const [filters, setFilters] = useState({
    status: "upcoming",
    sportType: "all",
    timeFrame: "any"
  });
  
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Convert UI filter state to API query params
  const getQueryParams = () => {
    const params: Record<string, string> = {};
    
    if (filters.status === "upcoming") {
      params.status = "upcoming";
    } else if (filters.status === "completed") {
      // For completed, we want won, lost, and void predictions
      params.status = "completed";
    }
    
    if (filters.sportType !== "all") {
      params.sportType = filters.sportType;
    }
    
    if (filters.timeFrame !== "any") {
      params.timeFrame = filters.timeFrame;
    }
    
    return params;
  };
  
  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions', getQueryParams()],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const handleFilterChange = (newFilters: { status: string; sportType: string; timeFrame: string }) => {
    setFilters(newFilters);
    // Reset visible count when filters change
    setVisibleCount(6);
  };
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  
  const visiblePredictions = predictions?.slice(0, visibleCount);
  const hasMore = predictions && visibleCount < predictions.length;
  
  return (
    <section className="bg-primary-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-montserrat font-bold text-3xl text-white">Latest Predictions</h1>
            <p className="mt-2 text-gray-300">
              Our expert picks for upcoming sports events
            </p>
          </div>
          
          {/* Filters Component */}
          <PredictionFilters onFilterChange={handleFilterChange} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-accent-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePredictions?.map((prediction) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction}
                />
              ))}
              
              {visiblePredictions?.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  No predictions found for the selected filters
                </div>
              )}
            </div>
            
            {hasMore && (
              <div className="mt-10 text-center">
                <Button 
                  onClick={handleLoadMore}
                  className="bg-primary-800 hover:bg-primary-700 border border-primary-700 text-white inline-flex items-center"
                >
                  Load More
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
