import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <InputGroup>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          required
          className={cn("!pl-1", className)}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            type="button"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
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
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export default PasswordInput;
