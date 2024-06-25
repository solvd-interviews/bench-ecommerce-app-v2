import Card from "@/components/Card";
import { sampleData } from "@/lib/data";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sampleData.products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
}
