"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryCreateForm from "./CategoryCreateForm";

export default function CategoryCreateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{"Add Category"}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{"Add New Category"}</DialogTitle>
        </DialogHeader>
        <CategoryCreateForm
          onSubmit={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
