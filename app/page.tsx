"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, Shield, Wallet, Globe, Zap, Users, ArrowRight, Star, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [marketData, setMarketData] = useState([
    { symbol: "BTC/USD", price: 43250.5, change: 2.45 },
    { symbol: "ETH/USD", price: 2680.3, change: -1.2 },
    { symbol: "EUR/USD", price: 1.0845, change: 0.15 },
    { symbol: "GBP/USD", price: 1.265, change: -0.35 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 5,
        })),
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Multi-Currency Wallet",
      description: "Secure digital wallet supporting 30+ currencies with instant transfers",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Advanced Trading",
      description: "Professional trading tools with real-time market data and analytics",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-Grade Security",
      description: "Multi-factor authentication and enterprise-level encryption",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Marketplace",
      description: "Buy and sell digital assets with escrow protection",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Payments",
      description: "30+ payment methods including mobile money and crypto",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "KYC Compliance",
      description: "Automated identity verification with ML-powered fraud detection",
    },
  ]

  const stats = [
    { value: "1M+", label: "Active Users" },
    { value: "$50B+", label: "Volume Traded" },
    { value: "150+", label: "Countries" },
    { value: "99.9%", label: "Uptime" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinTech Pro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            {marketData.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-medium">{item.symbol}</span>
                <span className="text-primary">${item.price.toFixed(2)}</span>
                <span className={`text-xs ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Trusted by 1M+ traders worldwide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            The Future of Digital Finance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional trading platform with multi-currency wallet, advanced analytics, and marketplace features.
            Trade with confidence on our premium fintech platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Trade</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive suite of tools and features designed for professional traders and investors
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/40 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">{feature.icon}</div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Overview Section */}
      <section className="py-12 px-4 bg-card/20">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Live Market Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketData.map((item, index) => (
              <Card key={index} className="border-border/40 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-1">{item.symbol}</div>
                  <div className="text-lg font-bold text-primary">${item.price.toFixed(2)}</div>
                  <div className={`text-sm ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of traders who trust FinTech Pro for their digital asset management
          </p>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">No hidden fees</span>
            <CheckCircle className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">24/7 support</span>
            <CheckCircle className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Instant verification</span>
          </div>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FinTech Pro</span>
            </div>
            <div className="text-muted-foreground text-sm">© 2024 FinTech Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
