"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductForm({
  onSubmit,
  initialData,
}: ProductFormProps) {
  return (
    <form action={onSubmit} className="flex flex-col gap-4">
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
