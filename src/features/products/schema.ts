import { z } from "zod";

const positiveId = z
  .number()
  .int()
  .nullable()
  .refine((v) => v != null && v > 0, { error: "Це поле обовʼязкове" });

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Назва: мінімум 2 символи")
    .max(120, "Назва: максимум 120 символів"),
  description: z.string().trim().max(2000, "Опис занадто довгий"),
  price: z
    .number({ error: "Має бути числом" })
    .gt(0, "Ціна має бути більше 0"),
  sku: z
    .string()
    .trim()
    .min(2, "SKU: мінімум 2 символи")
    .max(40, "SKU: максимум 40 символів"),
  categoryId: positiveId,
  supplierId: positiveId,
  receivedAt: z
    .string()
    .min(1, "Оберіть дату надходження")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Формат YYYY-MM-DD"),
  rating: z
    .number()
    .int()
    .min(0, "Мінімум 0")
    .max(5, "Максимум 5"),
  active: z.boolean(),
  images: z.array(z.string()).max(5, "Не більше 5 зображень"),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
