import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminPredictionForm from "@/components/admin-prediction-form";
import AdminPredictionTable from "@/components/admin-prediction-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useState } from "react";

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Additional admin stats could be added
  const { data: userCount } = useQuery<number>({
    queryKey: ['/api/admin/stats/users'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: false, // Disabled until API endpoint is created
  });
  
  return (
    <section className="bg-primary-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-montserrat font-bold text-3xl text-white">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Button className="bg-accent-500 text-primary-900 hover:bg-accent-400">
                Create Prediction
              </Button>
              <div className="relative">
                <Select
                  defaultValue="all"
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="bg-primary-800 border border-primary-700 rounded-lg py-2 text-white min-w-[160px]">
                    <SelectValue placeholder="All Predictions" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-800 border-primary-700">
                    <SelectItem value="all" className="text-white">All Predictions</SelectItem>
                    <SelectItem value="upcoming" className="text-white">Upcoming</SelectItem>
                    <SelectItem value="won" className="text-white">Won</SelectItem>
                    <SelectItem value="lost" className="text-white">Lost</SelectItem>
                    <SelectItem value="void" className="text-white">Void</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Optional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary-800 border-primary-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Total Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">--</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-800 border-primary-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">--</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-800 border-primary-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Premium Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">--</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Create Prediction Form */}
        <AdminPredictionForm />
        
        {/* Manage Predictions Table */}
        <AdminPredictionTable />
      </div>
    </section>
  );
}
