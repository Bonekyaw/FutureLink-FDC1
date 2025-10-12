import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router";

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordInput from "./input-password";
import { useState } from "react";

const FormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be 8 digits." })
    .max(8, { message: "Password must be 8 digits." })
    .regex(/^\d+$/, { message: "Password must be numeric." }),
  passwordConfirm: z
    .string()
    .min(8, { message: "Password must be 8 digits." })
    .max(8, { message: "Password must be 8 digits." })
    .regex(/^\d+$/, { message: "Password must be numeric." }),
});

export function ConfirmPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [clientError, setClientError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.password !== data.passwordConfirm) {
      setClientError("Passwords do not match!");
      return;
    }
    setClientError(null);
    navigate("/");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="mb-8 text-center">
          <CardTitle className="text-xl">Furniture Shop</CardTitle>
          <CardDescription>Please set up your password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                autoComplete="off"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          inputMode="numeric"
                          required
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>
                          This is your public display name.
                        </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Confirm Password</FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          inputMode="numeric"
                          required
                          minLength={8}
                          maxLength={8}
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>
                          This is your public display name.
                        </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {clientError && (
                  <p className="text-xs text-red-400">{clientError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Confirming..." : "Confirm"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
