"use client";

import { useState } from "react";

import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryUpdateForm from "./CategoryUpdateForm";

interface CategoryUpdateDialogProps {
  initialData: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryUpdateDialog({
  initialData,
}: CategoryUpdateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <CategoryUpdateForm
          initialData={initialData}
          onSubmit={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
