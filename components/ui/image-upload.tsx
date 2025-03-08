import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  inputName: string;
  initialInputName: string;
  required?: boolean;
  initialImageUrl?: string;
}

export const ImageUpload = ({
  inputName,
  initialInputName,
  required,
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
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        name={inputName}
        accept="image/*"
        onChange={handleImageChange}
        required={required}
      />
      <Input
        type="hidden"
        name={initialInputName}
        defaultValue={initialImageUrl}
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
