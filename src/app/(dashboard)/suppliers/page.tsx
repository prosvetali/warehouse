import { SuppliersTable } from "@/features/suppliers/components/SuppliersTable";

export const metadata = { title: "Постачальники · Warehouse" };

export default function SuppliersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Постачальники</h2>
      </div>
      <SuppliersTable />
    </div>
  );
}
