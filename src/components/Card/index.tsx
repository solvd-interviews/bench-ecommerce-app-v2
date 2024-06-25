import { Product } from "@/lib/models/ProductModel";
import Image from "next/image";

const Card = ({ product }: { product: Product }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure className="w-96 h-40 overflow-hidden">
        <Image
          src={product.image}
          alt="Shoes"
          width={400}
          height={400}
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
  );
};

export default Card;
