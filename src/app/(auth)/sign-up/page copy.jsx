"use client";

import { FloppyDisk } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

const shell =
  "rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white p-4 ring-1 ring-black/5 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10";

const field =
  "rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/5 transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-neutral-400/25 dark:ring-white/10 dark:focus-visible:ring-neutral-500/30";

const SignUpPage = () => {
  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
    alert("Form submitted successfully!");

    // const formData = new FormData(e.currentTarget);
    // const data = {};

    // // Convert FormData to plain object
    // formData.forEach((value, key) => {
    //   data[key] = value.toString();
    // });

    // alert("Form submitted successfully!");
  };

  return (
    <Form className="w-full max-w-96" onSubmit={onSubmit}>
      <Fieldset className={shell}>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>

        <Description>Update your profile information.</Description>

        <FieldGroup>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }
              return null;
            }}
          >
            <Label>Name</Label>
            <Input className={field} placeholder="John Doe" />
            <FieldError />
          </TextField>

          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input className={field} placeholder="john@example.com" />
            <FieldError />
          </TextField>
        </FieldGroup>

        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>

          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
};

export default SignUpPage;
