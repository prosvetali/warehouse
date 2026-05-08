"use client";

import { useEffect, useId, useMemo } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Rating } from "react-simple-star-rating";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Label } from "@/shared/ui/Label";
import { DatePicker } from "@/shared/ui/DatePicker";
import { HelpTooltip } from "@/shared/ui/HelpTooltip";
import { CategoryAsyncSelect } from "@/features/categories/components/CategoryAsyncSelect";
import { SupplierSelect } from "@/features/suppliers/components/SupplierSelect";
import { productSchema, type ProductFormSchema } from "../schema";
import { generateSku } from "../utils/sku";
import { ImageDropzone } from "./ImageDropzone";
import { BarcodePreview } from "./BarcodePreview";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProductMutations";
import type { Product } from "../types";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: Product;
}

const emptyDefaults: ProductFormSchema = {
  name: "",
  description: "",
  price: 0,
  sku: "",
  categoryId: null,
  supplierId: null,
  receivedAt: new Date().toISOString().slice(0, 10),
  rating: 0,
  active: true,
  images: [],
};

function toDefaults(product?: Product): ProductFormSchema {
  if (!product) {
    return { ...emptyDefaults };
  }
  return {
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    sku: product.sku,
    categoryId: product.categoryId,
    supplierId: product.supplierId,
    receivedAt: product.receivedAt,
    rating: product.rating,
    active: product.active,
    images: product.images ?? [],
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="text-xs text-[var(--color-danger)]">
      {message}
    </p>
  );
}

export function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const defaults = useMemo(() => toDefaults(initial), [initial]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const sku = watch("sku");

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(initial?.id ?? 0);
  const mutating = createMutation.isPending || updateMutation.isPending;

  const onSubmit: SubmitHandler<ProductFormSchema> = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      sku: values.sku,
      categoryId: values.categoryId as number,
      supplierId: values.supplierId as number,
      receivedAt: values.receivedAt,
      rating: values.rating,
      active: values.active,
      images: values.images,
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (initial) {
        await updateMutation.mutateAsync(payload);
      } else {
        return;
      }
      router.push("/products");
    } catch {
      // помилку вже показує onError у useCreateProduct / useUpdateProduct
    }
  };

  const ids = {
    name: useId(),
    description: useId(),
    price: useId(),
    sku: useId(),
    category: useId(),
    supplier: useId(),
    receivedAt: useId(),
    rating: useId(),
    active: useId(),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-md border border-[var(--color-border)] bg-white p-5">
        <h3 className="text-sm font-semibold text-[var(--color-muted)]">Основна інформація</h3>
        <div className="flex flex-col gap-1">
          <Label htmlFor={ids.name} required>
            Назва
          </Label>
          <Input
            id={ids.name}
            invalid={!!errors.name}
            placeholder="Наприклад, Дриль X120"
            {...register("name", {
              onBlur: () => {
                const currentSku = getValues("sku");
                const name = getValues("name");
                if (!currentSku && name.trim().length >= 2) {
                  setValue("sku", generateSku(name), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              },
            })}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={ids.description}>Опис</Label>
          <Textarea
            id={ids.description}
            invalid={!!errors.description}
            placeholder="Короткий опис товару"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={ids.price} required>
              Ціна, $
            </Label>
            <Input
              id={ids.price}
              type="number"
              step="0.01"
              min="0"
              invalid={!!errors.price}
              {...register("price", { valueAsNumber: true })}
            />
            <FieldError message={errors.price?.message} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor={ids.sku} required hint={
              <HelpTooltip content="Якщо залишити порожнім — згенерується автоматично з назви." />
            }>
              SKU
            </Label>
            <Input
              id={ids.sku}
              invalid={!!errors.sku}
              placeholder="DRL-X120"
              {...register("sku")}
            />
            <FieldError message={errors.sku?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Превʼю штрихкоду</Label>
          <BarcodePreview value={sku ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-[var(--color-border)] bg-white p-5">
        <h3 className="text-sm font-semibold text-[var(--color-muted)]">Класифікація</h3>
        <div className="flex flex-col gap-1">
          <Label htmlFor={ids.category} required>
            Категорія
          </Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <CategoryAsyncSelect
                inputId={ids.category}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                isInvalid={!!errors.categoryId}
              />
            )}
          />
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={ids.supplier} required>
            Постачальник
          </Label>
          <Controller
            control={control}
            name="supplierId"
            render={({ field }) => (
              <SupplierSelect
                inputId={ids.supplier}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                isInvalid={!!errors.supplierId}
              />
            )}
          />
          <FieldError message={errors.supplierId?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={ids.receivedAt} required>
            Дата надходження
          </Label>
          <Controller
            control={control}
            name="receivedAt"
            render={({ field }) => (
              <DatePicker
                inputId={ids.receivedAt}
                value={field.value}
                onChange={(v) => field.onChange(v ?? "")}
                invalid={!!errors.receivedAt}
              />
            )}
          />
          <FieldError message={errors.receivedAt?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <Label hint={<HelpTooltip content="Внутрішня оцінка якості, не показується клієнтам." />}>
            Внутрішній рейтинг
          </Label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <Rating
                initialValue={field.value}
                onClick={(v) => field.onChange(v)}
                size={28}
                allowFraction={false}
                SVGstyle={{ display: "inline-block" }}
                transition
              />
            )}
          />
          <FieldError message={errors.rating?.message} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id={ids.active} {...register("active")} />
          <Label htmlFor={ids.active} hint={<HelpTooltip content="Неактивні товари приховуються у каталозі." />}>
            Активний
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-white p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-[var(--color-muted)]">Зображення</h3>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageDropzone
              value={field.value}
              onChange={(next) => field.onChange(next)}
              invalid={!!errors.images}
            />
          )}
        />
        <FieldError message={errors.images?.message} />
      </div>

      <div className="flex justify-end gap-2 lg:col-span-2">
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>
          Скасувати
        </Button>
        <Button type="submit" loading={mutating} disabled={mode === "edit" && !isDirty}>
          {mode === "create" ? "Створити" : "Зберегти"}
        </Button>
      </div>

      {(createMutation.isError || updateMutation.isError) ? (
        <p className="lg:col-span-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Не вдалося зберегти. Спробуйте ще раз або перевірте підключення.
        </p>
      ) : null}

      {isSubmitting ? <span className="sr-only">Збереження…</span> : null}
    </form>
  );
}
