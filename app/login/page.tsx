"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://orghans.pythonanywhere.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(
          json?.non_field_errors?.[0] ||
            json?.detail ||
            json?.error ||
            "Login failed"
        );
        return;
      }

      const token =
        json?.token || json?.access || json?.key || json?.auth_token;

      if (token) {
        document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
      }

      if (json?.user) {
        localStorage.setItem("user", JSON.stringify(json.user));
      }

      router.push(from);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Hans Beauty</CardTitle>
          <CardDescription>
            Enter your account credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <Label className="mb-1 block text-sm">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1 block text-sm">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <CardFooter className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const from = searchParams?.get("from") || "/";

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const res = await fetch("https://orghans.pythonanywhere.com/api/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         // Pull a human-friendly error message from common keys
//         const message =
//           json?.non_field_errors?.[0] ||
//           json?.detail ||
//           json?.error ||
//           (typeof json === "string" ? json : JSON.stringify(json));
//         setError(message);
//         setLoading(false);
//         return;
//       }

//       // Determine a token from common response patterns
//       const token = json?.token || json?.access || json?.key || json?.auth_token || json?.id || null;

//       if (!token) {
//         // If no token found, store whole user object (fallback)
//         // but still proceed to dashboard in case server uses session cookie
//         console.warn("No token found in login response", json);
//       } else {
//         // Save token as a cookie so middleware (server) can read it
//         // Set a reasonable expiry (1 day)
//         const maxAge = 60 * 60 * 24; // 1 day in seconds
//         document.cookie = `token=${token}; path=/; max-age=${maxAge}; samesite=lax`;
//       }

//       // Optionally store user in localStorage for convenience
//       if (json?.user) {
//         localStorage.setItem("user", JSON.stringify(json.user));
//       }

//       // redirect to saved target (default to dashboard)
//       router.push(from);
//     } catch (err: any) {
//       setError(err?.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle>Sign in to Hans Beauty</CardTitle>
//         <CardDescription>Enter your account credentials to continue</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <div>
//             <Label className="mb-1 block text-sm">Email</Label>
//             <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
//           </div>

//           <div>
//             <Label className="mb-1 block text-sm">Password</Label>
//             <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
//           </div>

//           {error && <div className="text-sm text-destructive">{error}</div>}

//           <CardFooter className="pt-4">
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Signing in..." : "Sign in"}
//             </Button>
//           </CardFooter>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
