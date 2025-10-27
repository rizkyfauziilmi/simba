"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  ShoppingCart,
  Heart,
  Star,
  Settings,
  Bell,
  Lock,
  User,
  CreditCard,
  Check,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemePreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="">
      <div className="space-y-8">
        {/* Top Row: Media Player, Product, and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Media Player */}
          <Card className="lg:col-span-1 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Music Player</CardTitle>
              <CardDescription>Complex media interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-lg flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-lg bg-primary/30 mx-auto flex items-center justify-center">
                    <div className="w-16 h-16 rounded-lg bg-primary/50" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground">Midnight Dreams</h3>
                <p className="text-xs text-muted-foreground">Artist Name</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2:15</span>
                  <span>5:00</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full w-10 h-10"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-br from-accent/30 to-primary/30 h-40 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-primary/50" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-foreground">
                  Premium Headphones
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">(128)</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                High-quality audio with noise cancellation
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xl font-bold text-foreground">$299</span>
                <Button
                  size="sm"
                  variant={isFavorite ? "default" : "outline"}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>User preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Bell, label: "Notifications", enabled: true },
                { icon: Lock, label: "Privacy", enabled: false },
                { icon: Settings, label: "Preferences", enabled: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <Switch
                    disabled={!item.enabled}
                    defaultChecked={item.enabled}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle Row: Checkout and Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review and complete purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-2 pb-3 border-b border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Premium Headphones
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    $299.00
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">$299.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">$24.72</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">$333.72</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-foreground">
                  Payment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/50 bg-primary/5"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Card
                  </Button>
                  <Button variant="outline" size="sm">
                    PayPal
                  </Button>
                </div>
              </div>

              <Button className="w-full" size="sm">
                <Check className="w-3 h-3 mr-2" />
                Complete Purchase
              </Button>
            </CardContent>
          </Card>

          {/* User Profile & Stats */}
          <div className="space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">John Doe</h3>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {[
                  { label: "Orders", value: "24", color: "bg-primary/20" },
                  { label: "Wishlist", value: "12", color: "bg-accent/20" },
                  { label: "Reviews", value: "8", color: "bg-secondary/20" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${stat.color} text-center`}
                  >
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row: Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Support Chat</CardTitle>
            <CardDescription>Real-time messaging interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 h-48 overflow-y-auto bg-muted/30 p-4 rounded-lg">
              {/* Message from support */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                <div className="bg-muted p-3 rounded-lg max-w-xs">
                  <p className="text-sm text-foreground">
                    Hello! How can we help you today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2:30 PM</p>
                </div>
              </div>

              {/* Message from user */}
              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                  <p className="text-sm">I have a question about my order</p>
                  <p className="text-xs opacity-70 mt-1">2:31 PM</p>
                </div>
              </div>

              {/* Message from support */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                <div className="bg-muted p-3 rounded-lg max-w-xs">
                  <p className="text-sm text-foreground">
                    What&apos;s your order number?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2:32 PM</p>
                </div>
              </div>

              {/* Message from user */}
              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Order #12345</p>
                  <p className="text-xs opacity-70 mt-1">2:33 PM</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Input placeholder="Type your message..." className="text-sm" />
              <Button size="icon" className="h-9 w-9">
                <span className="text-lg">→</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
