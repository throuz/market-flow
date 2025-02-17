"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CategoryDialogProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    name: string;
  };
}

export default function CategoryDialog({
  onSubmit,
  initialData,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {initialData ? "Edit" : "Add Category"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await onSubmit(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Input
              name="name"
              placeholder="Category Name"
              defaultValue={initialData?.name}
              required
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
