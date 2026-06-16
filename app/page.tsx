// app/page.tsx
"use client";

import { Suspense } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeIcon, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// Mock auth
import { addToast } from "@heroui/toast";
import { ThemeSwitch } from "@/components/theme-switch";
import { z } from "zod";
import { Dancing_Script } from "next/font/google";

const scriptFont = Dancing_Script({ subsets: ["latin"] });

/**
 * Why: Cleanly split flows.
 * - Sign Up: stay on "checkEmail", confirmation link opens login (not auto-signed-in).
 * - Reset Password: stay on "reset" until returning with recovery session, then "update".
 */

// Mock auth

// ── Validation Schemas ────────────────────────────────────────────────────────
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
    "Password must include uppercase, lowercase, number, and symbol"
  );

function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error: any) {
    addToast({ title: error.errors?.[0]?.message ?? "Validation error", color: "danger" });
    return false;
  }
}

function validatePassword(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch (error: any) {
    addToast({ title: error.errors?.[0]?.message ?? "Validation error", color: "danger" });
    return false;
  }
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setViewState] = useState<
    "login" | "signup" | "reset" | "update" | "checkEmail" // CHANGED: add checkEmail
  >("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("dummy@example.com");
  const [password, setPassword] = useState("Password123!");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastPassword, setLastPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const setView = (v: typeof view) => {
    resetForm();
    setViewState(v);
  };

  // Check if already signed in mock
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("mock_session") === "true") {
        router.push("/dashboard");
      }
    }
  }, [router]);

  // Handle query param redirects when hash isn't present
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update");
    } else if (type === "signup") {
      // If a provider ever returns without tokens, still land on login
      setView("login");
    }
  }, [searchParams]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ── Auth Handlers ───────────────────────────────────────────────────────────
  const handleSignIn = useCallback(async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;
    try {
      setLoading(true);
      window.localStorage.setItem("mock_session", "true");
      addToast({ title: "Signed in successfully", color: "success" });
      router.push("/dashboard");
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const handleSignUp = useCallback(async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;
    try {
      setLoading(true);
      window.localStorage.setItem("mock_session", "true");
      addToast({ title: "Account created successfully!", color: "success" });
      router.push("/dashboard");
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const handleResetPassword = useCallback(async () => {
    if (!validateEmail(email)) return;
    try {
      setLoading(true);
      addToast({ title: "Reset password email sent. Check your inbox.", color: "success" });
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleUpdatePassword = useCallback(async () => {
    // Do NOT require email here; session from link identifies the user.
    if (!validatePassword(password)) return;
    if (password !== confirmPassword)
      return addToast({ title: "Passwords do not match.", color: "danger" });
    if (password === lastPassword)
      return addToast({ title: "New password must be different from old password.", color: "danger" });

    try {
      setLoading(true);
      addToast({ title: "Password updated. Please login.", color: "success" });
      setLastPassword(password);
      setView("login");
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, lastPassword]);

  // ── Inputs ─────────────────────────────────────────────────────────────────
  const PasswordInput = useMemo(
    () => (
      <Input
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        radius="sm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="faded"
        classNames={{ 
          inputWrapper: "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
          input: "text-foreground placeholder:text-foreground/60" 
        }}
        endContent={
          <Button
            isIconOnly
            variant="light"
            size="sm"
            type="button"
            onClick={togglePasswordVisibility}
            className="text-default-400">
            {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        }
      />
    ),
    [showPassword, password, togglePasswordVisibility]
  );

  const ConfirmPasswordInput = useMemo(
    () => (
      <Input
        placeholder="Confirm Password"
        type={showPassword ? "text" : "password"}
        radius="sm"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        variant="faded"
        classNames={{ 
          inputWrapper: "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
          input: "text-foreground placeholder:text-foreground/60" 
        }}
        endContent={
          <Button
            isIconOnly
            variant="light"
            size="sm"
            type="button"
            onClick={togglePasswordVisibility}
            className="text-default-400">
            {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        }
      />
    ),
    [confirmPassword, showPassword, togglePasswordVisibility]
  );

  // ── Panels ─────────────────────────────────────────────────────────────────
  const LeftPanel = useMemo(
    () => (
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -150, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full lg:w-[450px] xl:w-[500px] flex-1 lg:flex-none h-full bg-white/20 dark:bg-black/20 lg:border-r border-white/30 dark:border-white/10 shadow-2xl items-center justify-center p-8 relative z-10 overflow-hidden"
          style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
        <div className="flex flex-col gap-4 justify-center items-center h-full w-full max-w-xs">
          <div className="lg:hidden mb-8 text-center">
            <h1 className={`text-5xl font-bold text-foreground ${scriptFont.className}`}>MyBrand</h1>
          </div>
          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground m-auto">
                  Login Page
                </h2>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Email</p>
                  <Input
                    placeholder="Email"
                    type="email"
                    radius="sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="faded"
                    classNames={{
                      inputWrapper: "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
                      input: "text-foreground placeholder:text-foreground/60",
                    }}
                  />
                </div>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Password</p>
                  {PasswordInput}
                </div>
                <div className="flex justify-between w-full items-center gap-4">
                  <Button
                    radius="sm"
                    className="flex-1 bg-blue-600 text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/10 border-1 border-transparent"
                    onClick={handleSignIn}
                    isLoading={loading}
                    disabled={loading}>
                    Sign In
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => setView("reset")}
                    className="text-foreground">
                    Forgot Password?
                  </Button>
                </div>
                <p className="text-sm text-foreground m-auto">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="light"
                    size="sm"
                    className="min-w-0 p-0 h-auto bg-transparent hover:bg-transparent underline underline-offset-2"
                    onClick={() => setView("signup")}>
                    Sign Up
                  </Button>
                </p>
              </motion.div>
            )}

            {view === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground m-auto">
                  Sign Up
                </h2>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Email</p>
                  <Input
                    placeholder="Email"
                    type="email"
                    radius="sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="faded"
                    classNames={{
                      inputWrapper: "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
                      input: "text-foreground placeholder:text-foreground/60",
                    }}
                  />
                </div>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Password</p>
                  {PasswordInput}
                </div>
                <Button
                  className="w-full bg-blue-600 text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/10 border-1 border-transparent"
                  onClick={handleSignUp}
                  isLoading={loading}
                  disabled={loading}>
                  Create Account
                </Button>
                <p className="text-sm text-foreground m-auto">
                  Already have an account?{" "}
                  <Button
                    variant="light"
                    size="sm"
                    className="min-w-0 p-0 h-auto bg-transparent hover:bg-transparent underline underline-offset-2"
                    onClick={() => setView("login")}>
                    Login
                  </Button>
                </p>
              </motion.div>
            )}

            {view === "checkEmail" && (
              <motion.div
                key="checkEmail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground m-auto">
                  Confirm your email
                </h2>
                <p className="text-sm text-foreground/80 text-center">
                  We’ve sent a confirmation link to <b>{email}</b>. Open it to
                  activate your account. The link opens this site in a new tab
                  and will take you to the login page.
                </p>
                <div className="flex gap-2">
                  <Button
                    radius="sm"
                    className="flex-1 bg-blue-600 text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/10 border-1 border-transparent"
                    onClick={() => setView("signup")}>
                    Use a different email
                  </Button>
                  <a
                    className="flex-1"
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noreferrer">
                    <Button radius="sm" className="w-full dark:text-white dark:hover:bg-white/10" variant="light">
                      Open Gmail
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

            {view === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground m-auto">
                  Reset Password
                </h2>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Email</p>
                  <Input
                    placeholder="Email"
                    type="email"
                    radius="sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="faded"
                    classNames={{
                      inputWrapper: "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
                      input: "text-foreground placeholder:text-foreground/60",
                    }}
                  />
                </div>
                <Button
                  className="w-full bg-blue-600 text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/10 border-1 border-transparent"
                  onClick={handleResetPassword}
                  isLoading={loading}
                  disabled={loading}>
                  Send Reset Email
                </Button>
                <p className="text-xs text-foreground/80 text-center">
                  After you click the link in your email, you'll be brought back
                  here to set a new password.
                </p>
                <p className="text-sm text-foreground m-auto">
                  Remember your password?{" "}
                  <Button
                    variant="light"
                    size="sm"
                    className="min-w-0 p-0 h-auto bg-transparent hover:bg-transparent underline underline-offset-2"
                    onClick={() => setView("login")}>
                    Login
                  </Button>
                </p>
              </motion.div>
            )}

            {view === "update" && (
              <motion.div
                key="update"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground m-auto">
                  Insert New Password
                </h2>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">New Password</p>
                  {PasswordInput}
                </div>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">
                    Confirm New Password
                  </p>
                  {ConfirmPasswordInput}
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  isLoading={loading}
                  className="w-full bg-blue-600 text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/10 border-1 border-transparent">
                  Update Password
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    ),
    [
      view,
      email,
      password,
      confirmPassword,
      PasswordInput,
      ConfirmPasswordInput,
      handleSignIn,
      handleSignUp,
      handleResetPassword,
      handleUpdatePassword,
      loading,
    ]
  );

  const RightPanel = useMemo(
    () => (
      <motion.div
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 text-center relative z-0">
        <div className="flex flex-col gap-4 items-center justify-center max-w-md">
          <h1 className={`text-6xl font-bold text-foreground ${scriptFont.className}`}>MyBrand</h1>
          <p className="text-lg text-foreground/70">
            Welcome to <span className={`text-2xl ${scriptFont.className}`}>MyBrand</span>, your trusted platform for seamless
            authentication and secure access.
          </p>
        </div>
        <footer className="absolute bottom-4 text-sm text-foreground/50">
          © {new Date().getFullYear()} <span className={`text-base ${scriptFont.className}`}>MyBrand</span>. All rights reserved.
        </footer>
      </motion.div>
    ),
    []
  );

  return (
    <Suspense fallback={null}>
      <div className="flex h-[100dvh] overflow-hidden flex-col lg:flex-row relative bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cyan-300/20 dark:bg-cyan-700/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        </div>
        {LeftPanel}
        {RightPanel}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeSwitch />
        </div>
      </div>
    </Suspense>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
