"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/database.types";

interface ProductFormProps {
  initialData?: Database["public"]["Tables"]["products"]["Row"];
  onSubmit: (formData: FormData) => Promise<{ error: any }>;
}

export default function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {
  const [error, setError] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    const { error } = await onSubmit(formData);
    if (error) setError(error.message);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Input
        type="text"
        name="name"
        defaultValue={initialData?.name}
        placeholder="Product name"
        required
      />
      <Input
        type="number"
        name="category_id"
        defaultValue={initialData?.category_id}
        placeholder="Category ID"
        required
      />
      <Textarea
        name="description"
        defaultValue={initialData?.description ?? ""}
        placeholder="Description"
      />
      <Input
        type="number"
        name="price_per_unit"
        defaultValue={initialData?.price_per_unit}
        placeholder="Price per unit"
        step="0.01"
        required
      />
      <Input
        type="url"
        name="image_url"
        defaultValue={initialData?.image_url}
        placeholder="Image URL"
        required
      />
      <Input
        type="number"
        name="stock_quantity"
        defaultValue={initialData?.stock_quantity}
        placeholder="Stock quantity"
        required
      />
      <Select name="unit" defaultValue={initialData?.unit}>
        <SelectTrigger>
          <SelectValue placeholder="Select unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="piece">Piece</SelectItem>
          <SelectItem value="kg">Kilogram</SelectItem>
          <SelectItem value="gram">Gram</SelectItem>
          <SelectItem value="liter">Liter</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Switch
          name="is_active"
          defaultChecked={initialData?.is_active ?? true}
        />
        <span>Active</span>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}
