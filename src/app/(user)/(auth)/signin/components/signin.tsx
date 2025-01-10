"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { ReactNode, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SignInProps {
  children: ReactNode;
}

const SignInButton = ({ children }: SignInProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <Button
      onClick={() => signIn("google", { callbackUrl })}
      variant="outline"
      className="mb-7 w-full"
      size="lg"
    >
      {children}
    </Button>
  );
};

const SignIn: React.FC<SignInProps> = ({ children }) => {
  return (
    <Suspense>
      <SignInButton>{children}</SignInButton>
    </Suspense>
  );
};

export default SignIn;