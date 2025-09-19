"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const { user, sendEmailVerification, signOut } = useAuth()
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.emailVerified) {
      setIsVerified(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    }

    const interval = setInterval(async () => {
      if (user && !user.emailVerified) {
        await user.reload()
        if (user.emailVerified) {
          setIsVerified(true)
          setTimeout(() => router.push("/dashboard"), 2000)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [user, router])

  const handleResendEmail = async () => {
    if (!user) return

    setIsResending(true)
    setResendMessage("")

    try {
      await sendEmailVerification(user)
      setResendMessage("✅ تم إرسال رسالة التحقق بنجاح! تحقق من بريدك الإلكتروني.")
    } catch (error: any) {
      console.error(error)
      setResendMessage("❌ حدث خطأ أثناء إرسال رسالة التحقق. حاول مرة أخرى.")
    } finally {
      setIsResending(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (!user) return null

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">تم التحقق بنجاح!</CardTitle>
            <CardDescription>
              تم التحقق من بريدك الإلكتروني بنجاح. سيتم توجيهك إلى لوحة التحكم...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription>
            لقد أرسلنا رسالة تحقق إلى <strong>{user.email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>تحقق من صندوق الوارد الخاص بك وانقر على رابط التحقق لتفعيل حسابك.</p>
            <p>لم تجد الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها.</p>
          </div>

          {resendMessage && (
            <Alert>
              <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
              variant="outline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  إعادة إرسال رسالة التحقق
                </>
              )}
            </Button>

            <Button onClick={handleSignOut} variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              تسجيل الخروج والعودة لتسجيل الدخول
            </Button>
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 underline">
              الانتقال إلى لوحة التحكم (إذا تم التحقق بالفعل)
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
