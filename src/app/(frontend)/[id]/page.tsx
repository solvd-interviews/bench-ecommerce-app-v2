"use client"
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/models/ProductModel';
import Image from 'next/image';
import { register } from 'swiper/element/bundle';

register();

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        navigation?: string;
        pagination?: string;
        loop?: string;
      }, HTMLElement>,
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
    }
  }
}

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams()



  useEffect(() => {
    if (typeof id === 'string') {
      setLoading(true);
      fetch(`/api/${id}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to fetch product');
          }
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load product');
          console.error('Fetch error:', err);
          setLoading(false);
        });
    }
  }, [id])
  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row justify-around items-start my-8 mx-auto p-4 max-w-4xl">
      <div className="w-full md:w-1/2 px-2 py-4">
        {product.images && product.images.length > 1 ? (
          <swiper-container navigation="true" pagination="true">
            {product.images.map((image, index) => (
              <swiper-slide key={index}>
                <Image
                  src={image}
                  alt={`Slide ${index}`}
                  width={400}
                  height={400}
                  className="object-cover w-full"
                />
              </swiper-slide>
            ))}
          </swiper-container>
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full"
          />
        )}
      </div>
      <div className="w-full md:w-1/2 px-2 py-4">
        <h1 className="text-xl md:text-2xl font-bold">{product.name}</h1>
        <p className="my-2 md:my-4">{product.description}</p>
        <p className="text-lg md:text-xl font-semibold">${product.price}</p>
        <button className="btn btn-primary mt-4 w-full md:w-auto">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;