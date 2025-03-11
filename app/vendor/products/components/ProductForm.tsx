"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductForm({
  categories,
  onSubmit,
  initialData,
}: ProductFormProps) {
  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          type="text"
          name="name"
          defaultValue={initialData?.name}
          placeholder="Product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          name="category_id"
          defaultValue={initialData?.category_id?.toString()}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          placeholder="Description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price per Unit</Label>
        <Input
          id="price"
          type="number"
          name="price_per_unit"
          defaultValue={initialData?.price_per_unit}
          placeholder="Price per unit"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImageUpload
          inputName="image"
          initialInputName="image_url"
          initialImageUrl={initialData?.image_url}
          required={!initialData}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          type="number"
          name="stock_quantity"
          defaultValue={initialData?.stock_quantity}
          placeholder="Stock quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select name="unit" defaultValue={initialData?.unit}>
          <SelectTrigger id="unit">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="piece">Piece</SelectItem>
            <SelectItem value="kg">Kilogram</SelectItem>
            <SelectItem value="g">Gram</SelectItem>
            <SelectItem value="catty">Catty</SelectItem>
            <SelectItem value="tael">Tael</SelectItem>
            <SelectItem value="bundle">Bundle</SelectItem>
            <SelectItem value="box">Box</SelectItem>
            <SelectItem value="bag">Bag</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}
