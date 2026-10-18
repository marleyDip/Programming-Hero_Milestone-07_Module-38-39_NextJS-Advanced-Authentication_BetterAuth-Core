"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useState } from "react";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      const confirmInput =
        event.currentTarget.elements.namedItem("confirmPassword");

      if (confirmInput instanceof HTMLInputElement) {
        confirmInput.setCustomValidity("Passwords do not match.");
        confirmInput.reportValidity();
      }

      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setMessage(error.message ?? "Unable to create your account.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
      <Fieldset className="w-full">
        <FieldGroup className="gap-5">
          <TextField
            className="w-full"
            name="name"
            isRequired
            validate={(value) =>
              value.trim().length < 3
                ? "Name must be at least 3 characters."
                : null
            }
          >
            <Label>Full Name</Label>
            <Input
              className="w-full"
              fullWidth
              placeholder="John Doe"
              autoComplete="name"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full"
            name="email"
            type="email"
            isRequired
            validate={(value) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? null
                : "Please enter a valid email address."
            }
          >
            <Label>Email Address</Label>
            <Input
              className="w-full"
              fullWidth
              placeholder="john@example.com"
              autoComplete="email"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full"
            name="password"
            type="password"
            isRequired
            validate={(value) =>
              value.length < 8
                ? "Password must contain at least 8 characters."
                : null
            }
          >
            <Label>Password</Label>
            <Input
              className="w-full"
              fullWidth
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full"
            name="confirmPassword"
            type="password"
            isRequired
            validate={(value) => {
              const form = document.querySelector("form");
              const passwordInput = form?.elements.namedItem("password");

              if (!(passwordInput instanceof HTMLInputElement)) {
                return null;
              }

              return value !== passwordInput.value
                ? "Passwords do not match."
                : null;
            }}
          >
            <Label>Confirm Password</Label>
            <Input
              className="w-full"
              fullWidth
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <FieldError />
          </TextField>
        </FieldGroup>
      </Fieldset>

      {message && (
        <p role="alert" className="w-full text-sm text-rose-400">
          {message}
        </p>
      )}

      <Button type="submit" isDisabled={loading} className="w-full">
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </Form>
  );
}
