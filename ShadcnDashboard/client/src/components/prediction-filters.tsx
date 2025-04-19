import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PredictionFiltersProps {
  onFilterChange: (filters: {
    status: string;
    sportType: string;
    timeFrame: string;
  }) => void;
}

export default function PredictionFilters({ onFilterChange }: PredictionFiltersProps) {
  const [activeStatus, setActiveStatus] = useState<string>("upcoming");
  const [sportType, setSportType] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("any");
  
  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    onFilterChange({
      status,
      sportType,
      timeFrame
    });
  };
  
  const handleSportTypeChange = (value: string) => {
    setSportType(value);
    onFilterChange({
      status: activeStatus,
      sportType: value,
      timeFrame
    });
  };
  
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
    onFilterChange({
      status: activeStatus,
      sportType,
      timeFrame: value
    });
  };
  
  return (
    <div className="mt-4 md:mt-0 space-y-3 md:space-y-0 md:flex md:space-x-4">
      {/* Status Toggle */}
      <div className="flex items-center bg-primary-800 rounded-lg p-1">
        <Button 
          variant="ghost"
          className={cn(
            "px-4 py-2 rounded font-medium text-sm",
            activeStatus === "upcoming" ? "bg-accent-500 text-primary-900" : "text-gray-300 hover:text-white"
          )}
          onClick={() => handleStatusChange("upcoming")}
        >
          Upcoming
        </Button>
        <Button 
          variant="ghost"
          className={cn(
            "px-4 py-2 rounded font-medium text-sm",
            activeStatus === "completed" ? "bg-accent-500 text-primary-900" : "text-gray-300 hover:text-white"
          )}
          onClick={() => handleStatusChange("completed")}
        >
          Completed
        </Button>
      </div>
      
      {/* Sport Filter Dropdown */}
      <div className="relative">
        <Select 
          value={sportType} 
          onValueChange={handleSportTypeChange}
        >
          <SelectTrigger className="bg-primary-800 border border-primary-700 rounded-lg py-2 text-white min-w-[120px]">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent className="bg-primary-800 border-primary-700">
            <SelectItem value="all" className="text-white focus:bg-primary-700 focus:text-white">All Sports</SelectItem>
            <SelectItem value="football" className="text-white focus:bg-primary-700 focus:text-white">Football</SelectItem>
            <SelectItem value="basketball" className="text-white focus:bg-primary-700 focus:text-white">Basketball</SelectItem>
            <SelectItem value="tennis" className="text-white focus:bg-primary-700 focus:text-white">Tennis</SelectItem>
            <SelectItem value="hockey" className="text-white focus:bg-primary-700 focus:text-white">Hockey</SelectItem>
            <SelectItem value="other" className="text-white focus:bg-primary-700 focus:text-white">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Date Filter */}
      <div className="relative">
        <Select 
          value={timeFrame} 
          onValueChange={handleTimeFrameChange}
        >
          <SelectTrigger className="bg-primary-800 border border-primary-700 rounded-lg py-2 text-white min-w-[120px]">
            <SelectValue placeholder="Any Time" />
          </SelectTrigger>
          <SelectContent className="bg-primary-800 border-primary-700">
            <SelectItem value="any" className="text-white focus:bg-primary-700 focus:text-white">Any Time</SelectItem>
            <SelectItem value="today" className="text-white focus:bg-primary-700 focus:text-white">Today</SelectItem>
            <SelectItem value="tomorrow" className="text-white focus:bg-primary-700 focus:text-white">Tomorrow</SelectItem>
            <SelectItem value="thisWeek" className="text-white focus:bg-primary-700 focus:text-white">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
