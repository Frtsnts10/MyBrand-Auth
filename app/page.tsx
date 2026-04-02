// app/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Mail, Lock, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeSwitch } from "@/components/theme-switch";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ── Zod Schemas ──────────────────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
});

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type EmailValues = z.infer<typeof emailSchema>;
type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

// ── Field Error ───────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-destructive mt-1"
    >
      {message}
    </motion.p>
  );
}

// ── Password Input with toggle ────────────────────────────────────────────────
function PasswordInputField({
  id,
  placeholder = "Password",
  error,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={cn("pl-9 pr-10", error && "border-destructive focus-visible:ring-destructive")}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { view, setView, loading, setLoading } = useAuthStore();

  // Login form
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  // Signup form
  const signupForm = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });
  // Reset form
  const resetForm = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  // Update password form
  const updateForm = useForm<UpdatePasswordValues>({ resolver: zodResolver(updatePasswordSchema) });

  const switchView = (v: typeof view) => {
    loginForm.reset(); signupForm.reset(); resetForm.reset(); updateForm.reset();
    setView(v);
  };

  // Handle Supabase hash sessions (recovery / email confirm)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash?.includes("access_token")) return;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const hashType = params.get("type");
    if (!(access_token && refresh_token)) return;

    supabase.auth.setSession({ access_token, refresh_token }).then(async ({ error }) => {
      if (error) { toast({ variant: "destructive", title: "Session error", description: error.message }); return; }
      if (hashType === "recovery") { switchView("update"); }
      else if (hashType === "signup") { await supabase.auth.signOut(); switchView("login"); }
      else { switchView("login"); }
    }).finally(() => {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    });
  }, []);

  // Handle query params
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") switchView("update");
    else if (type === "signup") switchView("login");
  }, [searchParams]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onLogin = async (data: LoginValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) throw error;
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sign in failed", description: err.message });
    } finally { setLoading(false); }
  };

  const onSignup = async (data: SignupValues) => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: `${baseUrl}?type=signup` },
      });
      if (error) throw error;
      toast({ title: "Check your email", description: `Confirmation sent to ${data.email}` });
      setView("checkEmail");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sign up failed", description: err.message });
    } finally { setLoading(false); }
  };

  const onReset = async (data: EmailValues) => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${baseUrl}?type=recovery`,
      });
      if (error) throw error;
      toast({ title: "Reset email sent", description: "Check your inbox for the reset link." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    } finally { setLoading(false); }
  };

  const onUpdatePassword = async (data: UpdatePasswordValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      switchView("login");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err.message });
    } finally { setLoading(false); }
  };

  // ── Panels ────────────────────────────────────────────────────────────────
  const formVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row relative overflow-hidden bg-background">
      {/* ── Left Panel ── */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex md:w-[420px] lg:w-[480px] shrink-0 flex-col items-center justify-center p-8 md:p-10 border-r border-border/40 bg-card"
      >
        {/* Subtle gradient blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">MyBrand</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Login ── */}
            {view === "login" && (
              <motion.div key="login" variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                  <p className="text-sm text-muted-foreground">Sign in to your MyBrand account</p>
                </div>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className={cn("pl-9", loginForm.formState.errors.email && "border-destructive focus-visible:ring-destructive")}
                        {...loginForm.register("email")}
                      />
                    </div>
                    <FieldError message={loginForm.formState.errors.email?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button type="button" onClick={() => switchView("reset")} className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <PasswordInputField
                      id="login-password"
                      error={loginForm.formState.errors.password?.message}
                      {...loginForm.register("password")}
                    />
                    <FieldError message={loginForm.formState.errors.password?.message} />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" isLoading={loading} id="btn-login">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  No account yet?{" "}
                  <button onClick={() => switchView("signup")} className="text-primary hover:underline font-medium">
                    Create one
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── Sign Up ── */}
            {view === "signup" && (
              <motion.div key="signup" variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Create account</h1>
                  <p className="text-sm text-muted-foreground">Join MyBrand — it only takes a minute</p>
                </div>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className={cn("pl-9", signupForm.formState.errors.email && "border-destructive focus-visible:ring-destructive")}
                        {...signupForm.register("email")}
                      />
                    </div>
                    <FieldError message={signupForm.formState.errors.email?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInputField
                      id="signup-password"
                      error={signupForm.formState.errors.password?.message}
                      {...signupForm.register("password")}
                    />
                    <FieldError message={signupForm.formState.errors.password?.message} />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" isLoading={loading} id="btn-signup">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => switchView("login")} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── Check Email ── */}
            {view === "checkEmail" && (
              <motion.div key="checkEmail" variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
                    <p className="text-sm text-muted-foreground">
                      We sent a confirmation link to your email. Click it to activate your account and then sign in.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => switchView("signup")} id="btn-different-email">
                      Use different email
                    </Button>
                    <Button variant="gradient" className="flex-1" onClick={() => switchView("login")} id="btn-go-login">
                      Sign in
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Reset Password ── */}
            {view === "reset" && (
              <motion.div key="reset" variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Forgot password?</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send a reset link.
                  </p>
                </div>
                <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        className={cn("pl-9", resetForm.formState.errors.email && "border-destructive focus-visible:ring-destructive")}
                        {...resetForm.register("email")}
                      />
                    </div>
                    <FieldError message={resetForm.formState.errors.email?.message} />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" isLoading={loading} id="btn-send-reset">
                    <RefreshCw className="h-4 w-4" /> Send Reset Link
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Remember it?{" "}
                  <button onClick={() => switchView("login")} className="text-primary hover:underline font-medium">
                    Back to sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── Update Password ── */}
            {view === "update" && (
              <motion.div key="update" variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Set new password</h1>
                  <p className="text-sm text-muted-foreground">
                    Choose a strong password for your account.
                  </p>
                </div>
                <form onSubmit={updateForm.handleSubmit(onUpdatePassword)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <PasswordInputField
                      id="new-password"
                      placeholder="New password"
                      error={updateForm.formState.errors.password?.message}
                      {...updateForm.register("password")}
                    />
                    <FieldError message={updateForm.formState.errors.password?.message} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <PasswordInputField
                      id="confirm-password"
                      placeholder="Confirm new password"
                      error={updateForm.formState.errors.confirmPassword?.message}
                      {...updateForm.register("confirmPassword")}
                    />
                    <FieldError message={updateForm.formState.errors.confirmPassword?.message} />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" isLoading={loading} id="btn-update-password">
                    Update Password <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <div className="absolute bottom-4 right-4">
          <ThemeSwitch />
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(250,60%,12%)] via-[hsl(262,70%,18%)] to-[hsl(200,70%,10%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(263_75%_65%/0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(200_90%_55%/0.15),transparent_60%)]" />

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0deg 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0deg 0% 100%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Secure · Fast · Reliable
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              One account,{" "}
              <span className="gradient-text">endless{" "}possibilities</span>
            </h2>

            <p className="text-base text-white/60 leading-relaxed mb-10">
              MyBrand gives you a seamless, secure authentication experience with enterprise-grade protection for your account.
            </p>

            {/* Feature list */}
            <div className="grid gap-3 text-left">
              {[
                { icon: ShieldCheck, label: "End-to-end encrypted sessions" },
                { icon: RefreshCw, label: "Instant password recovery" },
                { icon: Sparkles, label: "Passwordless email sign-in" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-white/80">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-white/30">
          © {new Date().getFullYear()} MyBrand. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  );
}
