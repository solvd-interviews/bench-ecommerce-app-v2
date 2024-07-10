import Card from "@/components/Card";
import { sampleData } from "@/lib/data";
import { fetchProducts } from "@/lib/utils/products";

export default async function Home() {
  const res = await fetchProducts();
  return (
    <div className="w-full  grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 p-2 ">
      {res.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
}
