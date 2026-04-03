import { signIn } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue.</p>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <form className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/dashboard/intake/new"} />

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          <Button formAction={signIn} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
