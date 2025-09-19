"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook, Apple } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      if (error.code === "auth/email-not-verified") {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before signing in.",
          variant: "destructive",
        })
        router.push("/auth/verify-email")
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true)
    try {
      switch (provider) {
        case "google":
          await signInWithGoogle()
          break
        case "facebook":
          await signInWithFacebook()
          break
        case "apple":
          await signInWithApple()
          break
      }
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>Sign in to your FinTech Pro account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" onClick={() => handleSocialLogin("google")} disabled={loading} className="w-full">
            <Chrome className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin("facebook")} disabled={loading} className="w-full">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin("apple")} disabled={loading} className="w-full">
            <Apple className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link href="/auth/forgot-password">
            <Button variant="link" className="p-0 h-auto text-primary">
              Forgot your password?
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
