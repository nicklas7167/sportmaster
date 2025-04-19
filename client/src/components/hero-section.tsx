import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 to-primary-800 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507290439931-a861b5a38200?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-center bg-cover"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white">
            Make Smarter <span className="text-accent-400">Sports Predictions</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Expert predictions to enhance your sports betting experience. From casual fans to serious bettors, we've got you covered.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/predictions">
              <Button 
                size="lg" 
                className="bg-accent-500 hover:bg-accent-400 text-primary-900 font-semibold px-8 w-full sm:w-auto"
              >
                Free Predictions
              </Button>
            </Link>
            <Link href={user ? "/profile" : "/auth"}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent-400 text-accent-400 hover:bg-primary-700 w-full sm:w-auto"
              >
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
