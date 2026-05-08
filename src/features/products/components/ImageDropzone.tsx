"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/shared/lib/cn";
import IconX from "@/shared/icons/x.svg";

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

interface ImageDropzoneProps {
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Не вдалося прочитати файл"));
    reader.readAsDataURL(file);
  });
}

export function ImageDropzone({ value, onChange, invalid }: ImageDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[], rejections: FileRejection[]) => {
      setError(null);
      if (rejections.length > 0) {
        const reason = rejections[0].errors[0];
        if (reason?.code === "file-too-large") {
          setError("Файл більше 2 MB");
        } else if (reason?.code === "file-invalid-type") {
          setError("Підтримуються лише зображення");
        } else if (reason?.code === "too-many-files") {
          setError(`Максимум ${MAX_FILES} файлів`);
        } else {
          setError(reason?.message ?? "Файл не прийнято");
        }
      }
      const slots = MAX_FILES - value.length;
      if (slots <= 0) {
        setError(`Максимум ${MAX_FILES} файлів`);
        return;
      }
      const accepting = accepted.slice(0, slots);
      try {
        const dataUrls = await Promise.all(accepting.map(readAsDataURL));
        onChange([...value, ...dataUrls]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Помилка читання файлів");
      }
    },
    [value, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: MAX_SIZE_BYTES,
    maxFiles: MAX_FILES,
    multiple: true,
    disabled: value.length >= MAX_FILES,
  });

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    setError(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed bg-white px-6 py-8 text-center transition-colors",
          isDragActive
            ? "border-[var(--color-brand)] bg-blue-50"
            : invalid
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-border)] hover:border-[var(--color-brand)]",
          value.length >= MAX_FILES ? "cursor-not-allowed opacity-60" : "",
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium">
          {value.length >= MAX_FILES
            ? "Досягнуто ліміт"
            : isDragActive
              ? "Відпустіть файли тут"
              : "Перетягніть або клацніть, щоб обрати фото"}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          До {MAX_FILES} зображень, кожне ≤ 2 MB
        </p>
      </div>
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {value.length > 0 ? (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((src, idx) => (
            <li
              key={`${src.slice(0, 32)}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-md border border-[var(--color-border)] bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Зображення ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                aria-label={`Видалити зображення ${idx + 1}`}
                className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[var(--color-danger)] shadow-sm hover:bg-white"
              >
                <IconX className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
