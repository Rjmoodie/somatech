import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle } from "lucide-react";

interface AnnouncementsSectionProps {
  announcements: string[];
}

const AnnouncementsSection = ({ announcements }: AnnouncementsSectionProps) => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map((announcement, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{announcement}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No announcements today</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">All systems operational</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsSection;