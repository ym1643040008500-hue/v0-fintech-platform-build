import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* اللوجو */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FinTech Pro</span>
          </Link>
        </div>

        {/* نموذج تسجيل الدخول */}
        <LoginForm />

        {/* روابط إضافية */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              أنشئ حساب
            </Link>
          </p>
          <p className="text-sm">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
