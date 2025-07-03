import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

interface AnnouncementsSectionProps {
  announcements: string[];
}

const AnnouncementsSection = ({ announcements }: AnnouncementsSectionProps) => {
  if (announcements.length > 0) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Megaphone className="h-4 w-4 mr-2" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.map((announcement, index) => (
            <div key={index} className="p-3 bg-muted/20 rounded-lg">
              <p className="text-sm">{announcement}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="p-6 text-center">
        <Megaphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No announcements today</p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsSection;