// components/LoginForm.tsx
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeIcon, EyeOff } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSignIn: () => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  showPassword,
  togglePasswordVisibility,
  loading,
}) => {
      const [view, setViewState] = useState<
        "login" | "signup" | "reset" | "update"
      >("login");

  return (
    <div className="w-full flex flex-col gap-4">
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
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          radius="sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          classNames={{
            input: "text-foreground placeholder:text-foreground/60",
          }}
          endContent={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="flex items-center justify-center cursor-pointer">
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-default-400" />
              ) : (
                <EyeIcon className="w-5 h-5 text-default-400" />
              )}
            </button>
          }
        />
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
        <button onClick={() => setView("signup")} className="cursor-pointer">
          Sign Up
        </button>
      </p>
    </div>
  );
};
