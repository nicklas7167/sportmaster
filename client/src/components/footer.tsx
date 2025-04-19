import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Newsletter Subscribed",
      description: `${email} has been added to our newsletter list.`,
    });
    setEmail("");
  };
  
  return (
    <footer className="bg-primary-900 pt-12 pb-8 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <span className="font-montserrat text-xl font-bold text-accent-400">SportsMaster</span>
            <p className="mt-4 text-gray-400 text-sm">
              Expert sports predictions to enhance your betting experience. Always bet responsibly.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Home</a></Link></li>
              <li><Link href="/predictions"><a className="text-gray-400 hover:text-white transition-colors">Predictions</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Pricing</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">About Us</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Responsible Gambling</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for free predictions and updates.</p>
            <form onSubmit={handleSubscribe}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-primary-800 border-primary-700 rounded-r-none text-white focus:ring-accent-400 focus:border-accent-400"
                />
                <Button 
                  type="submit" 
                  className="bg-accent-500 hover:bg-accent-400 text-primary-900 rounded-l-none"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SportsMaster. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
