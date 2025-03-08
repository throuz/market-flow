import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void; // Callback to pass image URL to parent
  initialImageUrl?: string; // Initial image URL if any
}

export const ImageUpload = ({
  onImageChange,
  initialImageUrl,
}: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl || null
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onImageChange(reader.result as string); // Pass the image URL to the parent
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Image preview"
            className="w-32 h-32 object-cover"
          />
        </div>
      )}
    </div>
  );
};
