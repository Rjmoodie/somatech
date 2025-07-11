import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  theme_preference: string;
  onboarding_completed: boolean;
  profile_completion_score: number;
}

interface ThemeSettingsProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const ThemeSettings = ({ profile, onUpdate }: ThemeSettingsProps) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await onUpdate({ theme_preference: newTheme });
  };

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      description: "Light theme for daytime use",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Dark theme for low-light environments",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      description: "Follow your system's theme setting",
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preference</CardTitle>
          <CardDescription>
            Choose your preferred theme for the SomaTech interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme || "system"} 
            onValueChange={handleThemeChange}
            className="space-y-3"
          >
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg border bg-background">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
          <CardDescription>
            See how different interface elements look in your selected theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Sample Button</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                  Primary
                </button>
                <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Secondary
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Sample Card</div>
              <div className="p-3 border rounded bg-card text-card-foreground">
                <div className="font-medium mb-1">Card Title</div>
                <div className="text-sm text-muted-foreground">
                  This is a sample card showing how content appears in your selected theme.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;