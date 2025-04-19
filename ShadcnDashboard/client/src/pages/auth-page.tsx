import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

type FormValues = z.infer<typeof insertUserSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Create form for login
  const loginForm = useForm<FormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  // Create form for registration
  const registerForm = useForm<FormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  // Handle login submission
  const onLoginSubmit = (data: FormValues) => {
    loginMutation.mutate(data);
  };
  
  // Handle registration submission
  const onRegisterSubmit = (data: FormValues) => {
    registerMutation.mutate(data);
  };
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Auth Form */}
          <div>
            <Card className="bg-primary-800 border-primary-700">
              <CardHeader>
                <CardTitle className="font-montserrat text-2xl text-white text-center">Welcome to SportsMaster</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-primary-900 mb-4">
                    <TabsTrigger value="login" className="data-[state=active]:bg-accent-500 data-[state=active]:text-primary-900">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-accent-500 data-[state=active]:text-primary-900">
                      Register
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Login Form */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  className="bg-primary-900 border-primary-700 text-black"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  className="bg-primary-900 border-primary-700 text-black"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-accent-500 hover:bg-accent-400 text-primary-900"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* Register Form */}
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Choose a username" 
                                  className="bg-primary-900 border-primary-700 text-black"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Create a password" 
                                  className="bg-primary-900 border-primary-700 text-black"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-accent-500 hover:bg-accent-400 text-primary-900"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Hero content */}
          <div className="hidden md:block">
            <div className="text-white">
              <h1 className="font-montserrat font-bold text-4xl mb-6">
                Elevate Your <span className="text-accent-400">Sports Betting</span> Experience
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of satisfied members who have transformed their sports betting with our expert predictions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-accent-500/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Expert Analysis</h3>
                    <p className="text-gray-400">Our team of experts analyzes every match detail to provide you with the best picks.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-accent-500/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Real-Time Updates</h3>
                    <p className="text-gray-400">Get the latest predictions and status updates as they happen.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-accent-500/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Premium Insights</h3>
                    <p className="text-gray-400">Unlock high-value predictions with our premium membership.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
