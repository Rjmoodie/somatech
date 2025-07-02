import { useState } from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const EverythingMoney = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="text-xl font-bold">
            <span className="text-foreground">EVERY</span>
            <span className="text-success">THING</span>
          </div>
          <div className="text-xl font-bold ml-1">
            <span className="text-foreground">M</span>
            <span className="text-red-500">O</span>
            <span className="text-foreground">NEY</span>
          </div>
        </div>
        <Button variant="ghost" className="text-foreground">Login</Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Main Headline */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            Avoid The Waitlist: Only{' '}
            <span className="text-warning font-bold mx-1">4</span>
            {' '}Spots Left
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Form */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <h2 className="text-lg font-bold text-center mb-6">Create your account</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="text-muted-foreground mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-muted-foreground mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="text-muted-foreground mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="password" className="text-muted-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-warning hover:bg-warning/90 text-white font-medium py-3 rounded-lg"
              >
                Skip Waitlist
              </Button>
            </form>
          </div>

          {/* Right Column - Video/Image */}
          <div className="w-full">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-6 border-r-0 border-b-4 border-t-4 border-white border-t-transparent border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-foreground font-medium">Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
          <Card className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <div>
              <p className="font-medium text-foreground">10k+ Downloads</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-warning fill-current" />
                ))}
                <span className="ml-2 font-bold">4.3</span>
              </div>
              <p className="text-sm text-muted-foreground">249 reviews</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <div>
              <p className="font-medium text-foreground">10k+ Downloads</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-warning fill-current" />
                ))}
                <span className="ml-2 font-bold">4.6</span>
              </div>
              <p className="text-sm text-muted-foreground">197 reviews</p>
            </div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 mb-16">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">John Thesing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Everything Money has helped me feel more confident as an investor and steward of my money. 
                  I have outperformed the market every year since 2019 when I started investing, often by a very wide margin...
                </p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-warning fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Nassim Abed</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Everything Money's insightful approach and robust software have empowered my investment strategy, 
                  transforming complex financial data into actionable insights. Their eight pillars methodology and 
                  community support have been invaluable, leading to smarter investment decisions and tangible financial gains...
                </p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-warning fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-secondary">
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Support Chat</a>
            <a href="#" className="hover:text-foreground">help@everythingmoney.com</a>
            <a href="#" className="hover:text-foreground">Terms & Conditions</a>
            <a href="#" className="hover:text-foreground">ADA Compliance Statement</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EverythingMoney;