import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const PerformanceTracker = () => {
  const [energy, setEnergy] = useState([7]);
  const [stress, setStress] = useState([3]);
  const [focus, setFocus] = useState([8]);
  const [sleep, setSleep] = useState([7]);

  const calculateSomaticScore = () => {
    const score = (energy[0] + (10 - stress[0]) + focus[0] + sleep[0]) / 4;
    return Math.round(score * 10);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Somatic Performance Tracker</CardTitle>
          <CardDescription>Track your daily wellness metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Energy Level: {energy[0]}/10</Label>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stress Level: {stress[0]}/10</Label>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Focus Level: {focus[0]}/10</Label>
              <Slider
                value={focus}
                onValueChange={setFocus}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sleep Quality: {sleep[0]}/10</Label>
              <Slider
                value={sleep}
                onValueChange={setSleep}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {calculateSomaticScore()}/100
                </div>
                <Progress value={calculateSomaticScore()} className="mb-2" />
                <p className="text-sm text-muted-foreground">Your Somatic Score</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTracker;