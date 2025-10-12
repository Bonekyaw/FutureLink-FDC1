import { ConfirmPassword } from "@/components/auth/confirm-password";

export default function PasswordPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ConfirmPassword />
      </div>
    </div>
  );
}
