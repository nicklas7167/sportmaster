import { Prediction } from "@shared/schema";
import { Link } from "wouter";
import { formatDistance } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./status-badge";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  prediction: Prediction;
  isPremiumLocked?: boolean;
}

export default function PredictionCard({ prediction, isPremiumLocked }: PredictionCardProps) {
  const { isPremium, user } = useAuth();
  
  const formattedDate = () => {
    const date = new Date(prediction.startTime);
    const now = new Date();
    
    // If the date is today, yesterday, or tomorrow, use a more friendly format
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    const isTomorrow = new Date(now.setDate(now.getDate() + 2)).toDateString() === date.toDateString();
    
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    if (isTomorrow) return "Tomorrow";
    
    // Otherwise, show relative time
    return formatDistance(date, new Date(), { addSuffix: true });
  };
  
  const formattedTime = () => {
    const date = new Date(prediction.startTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const isPremiumCard = prediction.type === "premium";
  const isBlurred = isPremiumCard && !isPremium;
  
  return (
    <Card 
      className={cn(
        "bg-primary-800 border-primary-700 hover:border-gray-600 transition-all overflow-visible mt-6",
        isPremiumCard && "premium-card hover:shadow-accent-500/20 hover:shadow-lg relative"
      )}
    >
      {isPremiumCard && (
        <div className="premium-badge">
          PREMIUM
        </div>
      )}
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-gray-400 text-xs">{prediction.league}</span>
            <h3 className="font-medium text-white">{prediction.matchTitle}</h3>
          </div>
          <StatusBadge status={prediction.status} />
        </div>
        
        <div className="mb-4 pb-4 border-b border-primary-700">
          <div className="flex justify-between items-center">
            <div className={cn(isBlurred && "blur-[5px]")}>
              <div className="text-sm text-gray-400">Our Prediction</div>
              <div className="text-white font-medium">
                {isBlurred ? "********" : prediction.prediction}
              </div>
            </div>
            <div className="bg-primary-700 px-3 py-1 rounded font-mono text-white">
              {prediction.odds}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className={cn("text-gray-400", isBlurred && "blur-[5px]")}>
            <span>{formattedDate()}</span>
            <span className="mx-2">•</span>
            <span>{formattedTime()}</span>
          </div>
          <div>
            {isPremiumCard && !isPremium ? (
              <Link href={user ? "/profile" : "/auth"}>
                <Button size="sm" className="bg-accent-500 hover:bg-accent-400 text-primary-900">
                  Unlock
                </Button>
              </Link>
            ) : (
              <Link href={`/predictions/${prediction.id}`}>
                <a className="text-accent-400 hover:text-accent-500 font-medium">View Details</a>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
