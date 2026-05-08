import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h2 className="text-2xl font-semibold">Сторінку не знайдено</h2>
      <p className="text-sm text-[var(--color-muted)]">
        Перевірте URL або поверніться до каталогу товарів.
      </p>
      <Link href="/products">
        <Button>До товарів</Button>
      </Link>
    </div>
  );
}
