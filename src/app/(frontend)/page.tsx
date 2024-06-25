import { sampleData } from "@/lib/data";
import Image from "next/image";
export default function Home() {
  return (
    <div className="w-full grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sampleData.products.map((product) => (
        <div key={product.id} className="card bg-base-100 w-96 shadow-xl">
          <figure className="w-96 h-40 overflow-hidden">
            <img
              src={product.image}
              alt="Shoes"
              className="object-cover w-full h-full"
            />
          </figure>

          <div className="card-body">
            <h2 className="card-title">{product.name}</h2>
            <p>{product.description}</p>
            <div className="card-actions mt-4">
              <p className=" text-xl">${product.price}</p>
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
