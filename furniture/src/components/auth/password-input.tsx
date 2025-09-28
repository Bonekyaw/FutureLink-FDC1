import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        required
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-0 right-0 px-3 py-1 hover:bg-transparent"
        disabled={props.value === "" || props.disabled}
      >
        {showPassword ? (
          <EyeClosedIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show Password"}
        </span>
      </Button>
    </div>
  );
}

export default PasswordInput;
