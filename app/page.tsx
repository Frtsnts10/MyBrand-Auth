// // app/page.tsx
// "use client";

// import { useState, useMemo, useCallback, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@heroui/input";
// import { Button } from "@heroui/button";
// import { EyeIcon, EyeOff } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { createClient } from "@supabase/supabase-js";
// import { toast, Toaster } from "react-hot-toast";
// import { ThemeSwitch } from "@/components/theme-switch";
// import { z } from "zod";

// /**
//  * Why: Fixes validation error during password update.
//  * - Email is NOT required when updating password via recovery session.
//  * - Split validators so each flow validates only what it needs.
//  */

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// // ── Validation Schemas ────────────────────────────────────────────────────────
// const emailSchema = z.string().email("Invalid email address");
// const passwordSchema = z
//   .string()
//   .min(6, "Password must be at least 6 characters")
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
//     "Password must include uppercase, lowercase, number, and symbol"
//   );

// function validateEmail(email: string): boolean {
//   try {
//     emailSchema.parse(email);
//     return true;
//   } catch (error: any) {
//     toast.error(error.errors?.[0]?.message ?? "Validation error");
//     return false;
//   }
// }

// function validatePassword(password: string): boolean {
//   try {
//     passwordSchema.parse(password);
//     return true;
//   } catch (error: any) {
//     toast.error(error.errors?.[0]?.message ?? "Validation error");
//     return false;
//   }
// }

// export default function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [view, setViewState] = useState<
//     "login" | "signup" | "reset" | "update"
//   >("login");
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [lastPassword, setLastPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const resetForm = () => {
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//     setShowPassword(false);
//   };

//   const setView = (v: typeof view) => {
//     resetForm();
//     setViewState(v);
//   };

//   // Handle OAuth or recovery hash sessions from Supabase
//   useEffect(() => {
//     const hash = window.location.hash;
//     if (hash.includes("access_token")) {
//       const params = new URLSearchParams(hash.substring(1));
//       const access_token = params.get("access_token");
//       const refresh_token = params.get("refresh_token");

//       if (access_token && refresh_token) {
//         supabase.auth
//           .setSession({ access_token, refresh_token })
//           .then(({ error }) => {
//             if (error) toast.error("Session error: " + error.message);
//             else setView("update");
//           });
//       }
//     }
//   }, []);

//   // When coming from reset email link: /auth?type=recovery
//   useEffect(() => {
//     const type = searchParams.get("type");
//     if (type === "recovery") {
//       setView("update");
//     }
//   }, [searchParams]);

//   const togglePasswordVisibility = useCallback(() => {
//     setShowPassword((prev) => !prev);
//   }, []);

//   // ── Auth Handlers ───────────────────────────────────────────────────────────
//   const handleSignIn = useCallback(async () => {
//     if (!validateEmail(email) || !validatePassword(password)) return;
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) throw error;
//       toast.success("Signed in successfully");
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [email, password, router]);

//   const handleSignUp = useCallback(async () => {
//     if (!validateEmail(email) || !validatePassword(password)) return;
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.signUp({ email, password });
//       if (error) throw error;
//       toast.success("Account created successfully");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [email, password]);

//   const handleResetPassword = useCallback(async () => {
//     if (!validateEmail(email)) return;
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.resetPasswordForEmail(
//         email /*, { redirectTo: `${window.location.origin}/auth?type=recovery` } */
//       );
//       if (error) throw error;
//       toast.success("Reset password email sent");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [email]);

//   const handleUpdatePassword = useCallback(async () => {
//     // IMPORTANT: Do NOT require email here; session from link already identifies the user.
//     if (!validatePassword(password)) return;
//     if (password !== confirmPassword)
//       return toast.error("Passwords do not match.");
//     if (password === lastPassword)
//       return toast.error("New password must be different from old password.");

//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.updateUser({ password });
//       if (error) throw error;
//       toast.success("Password updated. Please login.");
//       setLastPassword(password);
//       setView("login");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [password, confirmPassword, lastPassword]);

//   // ── Inputs ─────────────────────────────────────────────────────────────────
//   const PasswordInput = useMemo(
//     () => (
//       <Input
//         placeholder="Password"
//         type={showPassword ? "text" : "password"}
//         radius="sm"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         classNames={{ input: "text-foreground placeholder:text-foreground/60" }}
//         endContent={
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="flex items-center justify-center cursor-pointer">
//             {showPassword ? (
//               <EyeIcon className="w-5 h-5 text-default-400" />
//             ) : (
//               <EyeOff className="w-5 h-5 text-default-400" />
//             )}
//           </button>
//         }
//       />
//     ),
//     [showPassword, password, togglePasswordVisibility]
//   );

//   const ConfirmPasswordInput = useMemo(
//     () => (
//       <Input
//         placeholder="Confirm Password"
//         type={showPassword ? "text" : "password"}
//         radius="sm"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         classNames={{ input: "text-foreground placeholder:text-foreground/60" }}
//         endContent={
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="flex items-center justify-center cursor-pointer">
//             {showPassword ? (
//               <EyeIcon className="w-5 h-5 text-default-400" />
//             ) : (
//               <EyeOff className="w-5 h-5 text-default-400" />
//             )}
//           </button>
//         }
//       />
//     ),
//     [confirmPassword, showPassword, togglePasswordVisibility]
//   );

//   // ── Panels ─────────────────────────────────────────────────────────────────
//   const LeftPanel = useMemo(
//     () => (
//       <motion.div
//         initial={{ x: -150, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         exit={{ x: -150, opacity: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="hidden md:flex flex-[2] bg-blue-300 dark:bg-blue-500 items-center justify-center p-8 relative">
//         <Toaster
//           position="top-center"
//           containerClassName="!absolute !top-1/2 !left-1/2 -translate-x-1/2 -translate-y-1/2"
//         />
//         <div className="flex flex-col gap-4 justify-center items-center h-full w-full max-w-xs">
//           <AnimatePresence mode="wait">
//             {view === "login" && (
//               <motion.div
//                 key="login"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-full flex flex-col gap-4">
//                 <h2 className="text-2xl font-semibold text-foreground m-auto">
//                   Login Page
//                 </h2>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">Email</p>
//                   <Input
//                     placeholder="Email"
//                     type="email"
//                     radius="sm"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     classNames={{
//                       input: "text-foreground placeholder:text-foreground/60",
//                     }}
//                   />
//                 </div>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">Password</p>
//                   {PasswordInput}
//                 </div>
//                 <div className="flex justify-between w-full items-center gap-4">
//                   <Button
//                     radius="sm"
//                     className="flex-1"
//                     onClick={handleSignIn}
//                     isLoading={loading}
//                     disabled={loading}>
//                     Sign In
//                   </Button>
//                   <button
//                     onClick={() => setView("reset")}
//                     className="text-sm text-foreground cursor-pointer">
//                     Forgot Password?
//                   </button>
//                 </div>
//                 <p className="text-sm text-foreground m-auto">
//                   Don't have an account?{" "}
//                   <button
//                     onClick={() => setView("signup")}
//                     className="cursor-pointer">
//                     Sign Up
//                   </button>
//                 </p>
//               </motion.div>
//             )}

//             {view === "signup" && (
//               <motion.div
//                 key="signup"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-full flex flex-col gap-4">
//                 <h2 className="text-2xl font-semibold text-foreground m-auto">
//                   Sign Up
//                 </h2>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">Email</p>
//                   <Input
//                     placeholder="Email"
//                     type="email"
//                     radius="sm"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     classNames={{
//                       input: "text-foreground placeholder:text-foreground/60",
//                     }}
//                   />
//                 </div>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">Password</p>
//                   {PasswordInput}
//                 </div>
//                 <Button
//                   className="w-full"
//                   onClick={handleSignUp}
//                   isLoading={loading}
//                   disabled={loading}>
//                   Create Account
//                 </Button>
//                 <p className="text-sm text-foreground m-auto">
//                   Already have an account?{" "}
//                   <button
//                     onClick={() => setView("login")}
//                     className="cursor-pointer">
//                     Login
//                   </button>
//                 </p>
//               </motion.div>
//             )}

//             {view === "reset" && (
//               <motion.div
//                 key="reset"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-full flex flex-col gap-4">
//                 <h2 className="text-2xl font-semibold text-foreground m-auto">
//                   Reset Password
//                 </h2>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">Email</p>
//                   <Input
//                     placeholder="Email"
//                     type="email"
//                     radius="sm"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     classNames={{
//                       input: "text-foreground placeholder:text-foreground/60",
//                     }}
//                   />
//                 </div>
//                 <Button
//                   className="w-full"
//                   onClick={handleResetPassword}
//                   isLoading={loading}
//                   disabled={loading}>
//                   Send Reset Email
//                 </Button>
//                 <p className="text-sm text-foreground m-auto">
//                   Remember your password?{" "}
//                   <button
//                     onClick={() => setView("login")}
//                     className="cursor-pointer">
//                     Login
//                   </button>
//                 </p>
//               </motion.div>
//             )}

//             {view === "update" && (
//               <motion.div
//                 key="update"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="w-full flex flex-col gap-4">
//                 <h2 className="text-2xl font-semibold text-foreground m-auto">
//                   Insert New Password
//                 </h2>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">New Password</p>
//                   {PasswordInput}
//                 </div>
//                 <div className="w-full">
//                   <p className="text-sm text-foreground mb-1">
//                     Confirm New Password
//                   </p>
//                   {ConfirmPasswordInput}
//                 </div>
//                 <Button
//                   onClick={handleUpdatePassword}
//                   isLoading={loading}
//                   className="w-full">
//                   Update Password
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>
//     ),
//     [
//       view,
//       email,
//       password,
//       confirmPassword,
//       PasswordInput,
//       ConfirmPasswordInput,
//       handleSignIn,
//       handleSignUp,
//       handleResetPassword,
//       handleUpdatePassword,
//       loading,
//     ]
//   );

//   const RightPanel = useMemo(
//     () => (
//       <motion.div
//         initial={{ x: 150, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="flex-[4] bg-white dark:bg-black flex flex-col items-center justify-center p-8 text-center">
//         <div className="flex flex-col gap-4 items-center justify-center max-w-md">
//           <h1 className="text-3xl font-bold text-foreground">MyBrand</h1>
//           <p className="text-lg text-foreground/70">
//             Welcome to MyBrand, your trusted platform for seamless
//             authentication and secure access.
//           </p>
//         </div>
//         <footer className="absolute bottom-4 text-sm text-foreground/50">
//           © {new Date().getFullYear()} MyBrand. All rights reserved.
//         </footer>
//       </motion.div>
//     ),
//     []
//   );

//   return (
//     <div className="flex min-h-screen flex-col md:flex-row relative">
//       {LeftPanel}
//       {RightPanel}
//       <div className="fixed bottom-4 right-4 z-50">
//         <ThemeSwitch />
//       </div>
//     </div>
//   );
// }

// app/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeIcon, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "react-hot-toast";
import { ThemeSwitch } from "@/components/theme-switch";
import { z } from "zod";

/**
 * Why: Cleanly split flows.
 * - Sign Up: stay on "checkEmail", confirmation link opens login (not auto-signed-in).
 * - Reset Password: stay on "reset" until returning with recovery session, then "update".
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    toast.error(error.errors?.[0]?.message ?? "Validation error");
    return false;
  }
}

function validatePassword(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch (error: any) {
    toast.error(error.errors?.[0]?.message ?? "Validation error");
    return false;
  }
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setViewState] = useState<
    "login" | "signup" | "reset" | "update" | "checkEmail" // CHANGED: add checkEmail
  >("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Handle OAuth/recovery hash sessions from Supabase
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const hashType = params.get("type"); // e.g., "signup" | "recovery" | "magiclink" | ...

    if (!(access_token && refresh_token)) return;

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(async ({ error }) => {
        if (error) {
          toast.error("Session error: " + error.message);
          return;
        }

        if (hashType === "recovery") {
          // Coming from reset password email → show Update Password
          setView("update");
        } else if (hashType === "signup") {
          // CHANGED: After confirming email, force manual login by signing out
          await supabase.auth.signOut();
          setView("login");
        } else {
          // Fallback: you can route somewhere sensible, e.g., login
          setView("login");
        }
      })
      .finally(() => {
        // Clean the URL hash
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search
        );
      });
  }, []);

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const handleSignUp = useCallback(async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;
    try {
      setLoading(true);

      const baseUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : "";

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}?type=signup`,
        },
      });
      if (error) throw error;

      toast.success("Account created. Please confirm via the email we sent.");
      setView("checkEmail");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const handleResetPassword = useCallback(async () => {
    if (!validateEmail(email)) return;
    try {
      setLoading(true);

      const baseUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}?type=recovery`,
      });
      if (error) throw error;

      toast.success("Reset password email sent. Check your inbox.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleUpdatePassword = useCallback(async () => {
    // Do NOT require email here; session from link identifies the user.
    if (!validatePassword(password)) return;
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");
    if (password === lastPassword)
      return toast.error("New password must be different from old password.");

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Please login.");
      setLastPassword(password);
      setView("login");
    } catch (err: any) {
      toast.error(err.message);
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
        classNames={{ input: "text-foreground placeholder:text-foreground/60" }}
        endContent={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="flex items-center justify-center cursor-pointer">
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-default-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-default-400" />
            )}
          </button>
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
        classNames={{ input: "text-foreground placeholder:text-foreground/60" }}
        endContent={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="flex items-center justify-center cursor-pointer">
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-default-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-default-400" />
            )}
          </button>
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
        className="hidden md:flex flex-[2] bg-blue-300 dark:bg-blue-500 items-center justify-center p-8 relative">
        <Toaster
          position="top-center"
          containerClassName="!absolute !top-1/2 !left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="flex flex-col gap-4 justify-center items-center h-full w-full max-w-xs">
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
                    classNames={{
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
                    className="flex-1"
                    onClick={handleSignIn}
                    isLoading={loading}
                    disabled={loading}>
                    Sign In
                  </Button>
                  <button
                    onClick={() => setView("reset")}
                    className="text-sm text-foreground cursor-pointer">
                    Forgot Password?
                  </button>
                </div>
                <p className="text-sm text-foreground m-auto">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="cursor-pointer">
                    Sign Up
                  </button>
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
                    classNames={{
                      input: "text-foreground placeholder:text-foreground/60",
                    }}
                  />
                </div>
                <div className="w-full">
                  <p className="text-sm text-foreground mb-1">Password</p>
                  {PasswordInput}
                </div>
                <Button
                  className="w-full"
                  onClick={handleSignUp}
                  isLoading={loading}
                  disabled={loading}>
                  Create Account
                </Button>
                <p className="text-sm text-foreground m-auto">
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="cursor-pointer">
                    Login
                  </button>
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
                    className="flex-1"
                    onClick={() => setView("signup")}>
                    Use a different email
                  </Button>
                  <a
                    className="flex-1"
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noreferrer">
                    <Button radius="sm" className="w-full" variant="light">
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
                    classNames={{
                      input: "text-foreground placeholder:text-foreground/60",
                    }}
                  />
                </div>
                <Button
                  className="w-full"
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
                  <button
                    onClick={() => setView("login")}
                    className="cursor-pointer">
                    Login
                  </button>
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
                  className="w-full">
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
        className="flex-[4] bg-white dark:bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="flex flex-col gap-4 items-center justify-center max-w-md">
          <h1 className="text-3xl font-bold text-foreground">MyBrand</h1>
          <p className="text-lg text-foreground/70">
            Welcome to MyBrand, your trusted platform for seamless
            authentication and secure access.
          </p>
        </div>
        <footer className="absolute bottom-4 text-sm text-foreground/50">
          © {new Date().getFullYear()} MyBrand. All rights reserved.
        </footer>
      </motion.div>
    ),
    []
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row relative">
      {LeftPanel}
      {RightPanel}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeSwitch />
      </div>
    </div>
  );
}
