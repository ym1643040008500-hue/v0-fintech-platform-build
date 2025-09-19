"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      // رسائل مخصصة حسب الأخطاء
      if (err.code === "auth/user-not-found") {
        setError("البريد الإلكتروني غير مسجل لدينا.")
      } else if (err.code === "auth/invalid-email") {
        setError("صيغة البريد الإلكتروني غير صحيحة.")
      } else {
        setError("حدث خطأ أثناء إرسال رسالة إعادة التعيين. حاول مرة أخرى.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">تم الإرسال بنجاح!</CardTitle>
            <CardDescription>
              تم إرسال رسالة إعادة تعيين كلمة المرور إلى <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>تحقق من صندوق الوارد الخاص بك وانقر على الرابط لإعادة تعيين كلمة المرور.</p>
              <p>لم تجد الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها.</p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => setSent(false)} variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                إرسال رسالة أخرى
              </Button>

              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FinTech Pro</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">نسيت كلمة المرور؟</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-800 underline">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
