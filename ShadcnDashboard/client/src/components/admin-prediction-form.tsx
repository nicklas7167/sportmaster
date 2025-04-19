import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPredictionSchema, InsertPrediction, sportTypes, predictionTypes } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

const formSchema = insertPredictionSchema.extend({
  startTime: z.string().refine(val => val !== "", {
    message: "Start time is required"
  })
});

type FormValues = Omit<InsertPrediction, "startTime"> & { startTime: string };

export default function AdminPredictionForm() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchTitle: "",
      league: "",
      sportType: "football",
      startTime: "",
      prediction: "",
      odds: "",
      type: "free",
      status: "upcoming",
      notes: ""
    }
  });
  
  const createPredictionMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Convert startTime from string to Date before sending to API
      const predictionData: InsertPrediction = {
        ...data,
        startTime: new Date(data.startTime)
      };
      
      const res = await apiRequest("POST", "/api/predictions", predictionData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Prediction created",
        description: "The prediction was created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating prediction",
        description: error.message || "There was an error creating the prediction.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: FormValues) => {
    createPredictionMutation.mutate(data);
  };
  
  useEffect(() => {
    // Set default startTime to current datetime-local value
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultDateTime = now.toISOString().slice(0, 16);
    form.setValue("startTime", defaultDateTime);
  }, [form]);
  
  return (
    <Card className="bg-primary-800 mb-8">
      <CardHeader>
        <CardTitle className="font-montserrat font-bold text-xl text-white">Create New Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="matchTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Match Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Team A vs Team B"
                        className="bg-primary-900 border-primary-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="league"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">League/Tournament</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Premier League"
                        className="bg-primary-900 border-primary-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Sport Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-primary-900 border-primary-700 text-white">
                          <SelectValue placeholder="Select sport type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-primary-800 border-primary-700">
                        {sportTypes.map((sport) => (
                          <SelectItem 
                            key={sport} 
                            value={sport}
                            className="text-white capitalize focus:bg-primary-700 focus:text-white"
                          >
                            {sport.charAt(0).toUpperCase() + sport.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Start Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        className="bg-primary-900 border-primary-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prediction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Prediction</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Home Win, Over 2.5 Goals"
                        className="bg-primary-900 border-primary-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="odds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Odds</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 1.85"
                        className="bg-primary-900 border-primary-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-300">Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-6"
                      >
                        {predictionTypes.map((type) => (
                          <FormItem key={type} className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className="text-white capitalize cursor-pointer">
                              {type}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-300">Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Analysis, justification or other notes..."
                        className="bg-primary-900 border-primary-700 text-white resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-accent-500 hover:bg-accent-400 text-primary-900"
                disabled={createPredictionMutation.isPending}
              >
                {createPredictionMutation.isPending ? "Creating..." : "Create Prediction"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
