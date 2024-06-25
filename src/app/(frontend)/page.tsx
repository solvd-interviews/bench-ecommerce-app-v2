import { sampleData } from "@/lib/data";
import Image from "next/image";
export default function Home() {
  return (
    <div className="w-full">
      {sampleData.products.map((product) => (
        <article key={product.id} className=" h-72 flex border-2 w-96">
          <div className="w-2/5  h-full">
            <Image
              src={product.image}
              width={50}
              height={100}
              alt={product.name}
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col w-3/5 h-full justify-between p-2">
            <h3 className="">{product.name}</h3>
            <p>{product.description}</p>
            <div className="flex justify-between p-2 px-4">
              <p>{product.price}</p>
              <button className="btn btn-primary ">Add to cart</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
