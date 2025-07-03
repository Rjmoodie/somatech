import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const FeaturedVideo = () => {
  const featuredVideo = {
    title: "SomaTech Financial Analysis Deep Dive",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "24:15",
    description: "Learn advanced valuation techniques and cash flow modeling with real-world examples."
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <PlayCircle className="h-5 w-5 mr-2" />
          Featured Video
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={featuredVideo.thumbnail} 
                alt={featuredVideo.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                  FEATURED
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                  {featuredVideo.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">{featuredVideo.title}</h3>
            <p className="text-muted-foreground">{featuredVideo.description}</p>
            <Button className="w-fit bg-red-600 hover:bg-red-700">
              <PlayCircle className="h-4 w-4 mr-2" />
              Watch Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedVideo;