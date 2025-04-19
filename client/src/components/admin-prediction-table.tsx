import { Prediction, predictionStatus } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminPredictionTable() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { data: predictions, isLoading, error } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/predictions/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The prediction status was updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message || "There was an error updating the prediction status.",
        variant: "destructive",
      });
    }
  });
  
  const deletePredictionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/predictions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Prediction deleted",
        description: "The prediction was deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting prediction",
        description: error.message || "There was an error deleting the prediction.",
        variant: "destructive",
      });
    }
  });
  
  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this prediction?")) {
      deletePredictionMutation.mutate(id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading predictions: {error.message}
      </div>
    );
  }
  
  // Sort predictions by newest first
  const sortedPredictions = [...(predictions || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Pagination
  const totalPages = Math.ceil((sortedPredictions?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPredictions = sortedPredictions?.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <Card className="bg-primary-800 overflow-hidden">
      <CardHeader className="border-b border-primary-700">
        <CardTitle className="font-montserrat font-bold text-xl text-white">Manage Predictions</CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary-900">
            <TableRow className="border-primary-700">
              <TableHead className="text-gray-400">Match</TableHead>
              <TableHead className="text-gray-400">Prediction</TableHead>
              <TableHead className="text-gray-400">Odds</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-primary-800 divide-y divide-primary-700">
            {paginatedPredictions?.map((prediction) => (
              <TableRow key={prediction.id} className="border-primary-700">
                <TableCell className="py-4">
                  <div>
                    <div className="text-sm font-medium text-white">{prediction.matchTitle}</div>
                    <div className="text-xs text-gray-400">
                      {prediction.league} • {format(new Date(prediction.startTime), "MMM d, HH:mm")}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-white">{prediction.prediction}</TableCell>
                <TableCell className="text-sm text-white">{prediction.odds}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    prediction.type === "premium" 
                      ? "bg-accent-500 text-primary-900" 
                      : "bg-gray-700 text-white"
                  }`}>
                    {prediction.type}
                  </span>
                </TableCell>
                <TableCell>
                  <Select 
                    defaultValue={prediction.status}
                    onValueChange={(value) => handleStatusChange(prediction.id, value)}
                  >
                    <SelectTrigger className="bg-primary-900 border-primary-700 text-sm text-white py-1 px-2 h-auto w-auto min-w-[110px]">
                      <SelectValue placeholder={prediction.status} />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-800 border-primary-700">
                      {predictionStatus.map((status) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                          className="text-white capitalize"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <Button
                    variant="link"
                    className="text-accent-400 hover:text-accent-500 px-2 py-0 h-auto"
                    onClick={() => {}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="text-red-500 hover:text-red-400 px-2 py-0 h-auto"
                    onClick={() => handleDelete(prediction.id)}
                    disabled={deletePredictionMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {paginatedPredictions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  No predictions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-primary-900 border-t border-primary-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedPredictions.length)} of {sortedPredictions.length} predictions
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-primary-700 text-white"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className={
                  page === currentPage 
                    ? "bg-accent-500 text-primary-900" 
                    : "bg-primary-800 text-white border-primary-700"
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              className="border-primary-700 text-white"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
