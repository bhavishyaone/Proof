import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      const result = await googleLogin(tokenResponse.access_token);
      setLoading(false);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    },
    onError: () => setError("Google login failed."),
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!form.password.trim()) return setError("Please enter your password.");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const benefits = [
    {
      title: "Effortless Collection",
      desc: "Get text and video testimonials with a simple link."
    },
    {
      title: "Wall of Love & Widgets",
      desc: "Embed beautiful testimonial carousels on any website."
    },
    {
      title: "Powerful Moderation",
      desc: "Approve, reject, and organize everything from your inbox."
    }
  ];

  return (
    <div className="min-h-screen flex overflow-hidden">

      <div className="hidden lg:flex lg:w-1/2 flex-shrink-0 flex-col justify-between px-16 py-12 bg-[#0A0A0A] relative overflow-hidden">
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Proof</span>
        </div>

        <div className="relative z-10 my-auto py-12">
          <h1 className="text-white font-black text-5xl leading-[1.1] mb-6 tracking-tight">
            Turn your customers<br />into your best marketing.
          </h1>
          <p className="text-[#A0A0A0] text-lg mb-10 max-w-md leading-relaxed">
            Proof makes it incredibly simple to collect both video and text testimonials, manage them in one place, and embed them anywhere.
          </p>

          <div className="space-y-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="w-full lg:w-1/2 flex-shrink-0 flex items-center justify-center p-8 bg-[#111111]">
        <div className="w-full max-w-[420px]">

          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-2xl shadow-none">
            <CardContent className="p-8">

              <h2 className="text-white text-2xl font-bold mb-1">Welcome back</h2>
              <p className="text-[#6B6B6B] text-sm mb-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-white font-semibold hover:underline">
                  Sign up
                </Link>
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 bg-white text-black border-white hover:bg-gray-100 hover:text-black font-medium py-5 rounded-lg text-sm mb-4"
                onClick={() => loginWithGoogle()}
                disabled={loading}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-5">
                <Separator className="flex-1 bg-[#2A2A2A]" />
                <span className="text-[#6B6B6B] text-xs uppercase tracking-widest whitespace-nowrap">
                  or continue with email
                </span>
                <Separator className="flex-1 bg-[#2A2A2A]" />
              </div>

              <form onSubmit={submit} className="space-y-4">

                <div className="space-y-1.5">
                  <Label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-widest">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email Adress."
                    value={form.email}
                    onChange={handleChange}
                    className="bg-[#222222] border-[#2A2A2A] text-white placeholder:text-[#3D3D3D] focus-visible:ring-0 focus-visible:border-white transition-colors duration-150 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-widest">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Your Password"
                      value={form.password}
                      onChange={handleChange}
                      className="bg-[#222222] border-[#2A2A2A] text-white placeholder:text-[#3D3D3D] focus-visible:ring-0 focus-visible:border-white transition-colors duration-150 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-white transition-colors duration-150"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors duration-150 rounded-lg py-5 text-sm"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {error && (
                  <p className="text-red-400 text-xs text-center mt-2">
                    {error}
                  </p>
                )}
              </form>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
