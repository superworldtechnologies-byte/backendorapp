"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StoredImage = {
  url?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function ServiceImageField({
  label,
  name,
  initialImage,
}: {
  label: string;
  name: "image" | "beforeImage" | "afterImage";
  initialImage?: StoredImage | null;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage?.url || "");
  const [urlValue, setUrlValue] = useState(initialImage?.url || "");
  const [remove, setRemove] = useState(false);

  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Upload a file or paste an image URL.
        </p>
      </div>

      {(previewUrl && !remove) ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          <Image
            src={previewUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed bg-muted/30 text-sm text-muted-foreground">
          No image selected
        </div>
      )}

      <div className="space-y-2">
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={urlValue}
          onChange={(e) => {
            setUrlValue(e.target.value);
            setPreviewUrl(e.target.value);
            setRemove(false);
          }}
          name={`${name}Url`}
        />

        <Input
          ref={fileRef}
          type="file"
          accept="image/*"
          name={`${name}File`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPreviewUrl(URL.createObjectURL(file));
            setUrlValue("");
            setRemove(false);
          }}
        />

        <input type="hidden" name={`${name}Remove`} value={remove ? "true" : "false"} />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            Choose file
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setPreviewUrl("");
              setUrlValue("");
              setRemove(true);
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}