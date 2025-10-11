import { InputOTPForm } from "@/components/auth/otp-input";

export default function OtpPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <InputOTPForm />
      </div>
    </div>
  );
}
