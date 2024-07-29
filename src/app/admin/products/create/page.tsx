"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { LuXCircle } from "react-icons/lu";
import { toast } from "sonner";
import { LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

const Page = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [isBlock, setIsBlock] = useState<boolean>(false);
  const [files, setFiles] = useState<any | File[]>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const clearForm = () => {
    setName("");
    setStock(0);
    setIsBlock(false);
    setDescription("");
    setPrice(0);
    setFiles(undefined);
    setIsUploading(false);
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    if (name.length < 3) {
      setIsUploading(false);
      return toast.error("The name should be greater than 2 characters.");
    }

    if (description.length < 15 && description.length > 90) {
      setIsUploading(false);
      return toast.error(
        "The description should be greater than 14 characters and less than 90."
      );
    }

    if (!price || price < 1) {
      setIsUploading(false);
      return toast.error("The price should be greater than 0.");
    }

    if (!files || files.length < 1) {
      setIsUploading(false);
      return toast.error("At least 1 file is required.");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", JSON.stringify(price));
    formData.set("stock", JSON.stringify(stock));
    formData.set("isBlock", JSON.stringify(isBlock));
    formData.set("imgLength", files.length);
    files.forEach((e: File, index: number) => {
      formData.set("image-" + index, files[index]);
    });
    try {
      const res = await fetch("/api/upload/product", {
        method: "post",
        body: formData,
      });
      if (res.status == 201) {
        toast.success("The product was added succesfully!");
      }
      const resJson = await res.json();
    } catch (error) {
      toast.error("There was an unexpected error! Contact support <3.");
      console.error("error is", error);
    }
    clearForm();
  };

  return (
    <div className="p-4 overflow-y-auto">
      <button className="btn btn-primary  w-24 mb-5">
        <Link
          href="/admin/products"
          className="flex w-full h-full gap-2 items-center"
        >
          <LuArrowLeft />
          <p>Back</p>
        </Link>
      </button>
      <form className="flex flex-col gap-4 ">
        <h2 className="font-bold text-3xl">Create a Product</h2>
        <label
          className="input input-bordered flex items-center gap-2 max-w-xs"
          htmlFor="name"
        >
          Name
          <input
            type="text"
            className="grow"
            placeholder="Playstation 4"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label
          htmlFor="name"
          className="input input-bordered flex items-center gap-2 max-w-xs"
        >
          Description
          <input
            className="grow"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="New plastation slim spiderman xl white"
          />
        </label>
        <label
          htmlFor="name"
          className="input input-bordered flex items-center gap-2 max-w-xs"
        >
          Price
          <input
            className="grow"
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="$50"
          ></input>
        </label>
        <label
          htmlFor="stock"
          className="input input-bordered flex items-center gap-2 max-w-xs"
        >
          Stock
          <input
            className="grow"
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(parseFloat(e.target.value))}
            placeholder="10"
          ></input>
        </label>
        <label htmlFor="block" className=" flex items-center gap-2 max-w-xs">
          Block
          <input
            className=" toggle"
            type="checkbox"
            id="price"
            checked={isBlock}
            onChange={(e) => setIsBlock(e.target.checked)}
          ></input>
        </label>
        <input
          type="file"
          multiple
          className="file-input file-input-bordered w-full max-w-xs"
          accept="image/png, image/jpg, image/jpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files?.length > 0) {
              const fileArray = Array.from(e.target.files);
              setFiles(fileArray);
            }
          }}
        />
        <div className="flex gap-2">
          {files &&
            files.map((e: File, index: number) => (
              <div
                key={e.name}
                className="flex flex-col border-2 w-64 h-64 items-center p-1"
              >
                <div className="flex w-full">
                  <p className="mr-1">{String(index + 1 + ") ")}</p>
                  <p className="w-full overflow-hidden text-nowrap">{e.name}</p>
                  <button
                    onClick={() => {
                      setFiles((prevState: File[]) => {
                        return prevState.filter(
                          (e: File, i: number) => index !== i
                        );
                      });
                    }}
                  >
                    <LuXCircle size={30} />
                  </button>
                </div>
                <Image
                  src={URL.createObjectURL(e)}
                  width={150}
                  height={150}
                  alt={e.name}
                  className="overflow-hidden border-2 "
                ></Image>
              </div>
            ))}
        </div>
        <button
          className="btn btn-primary mt-2 w-28 flex"
          onClick={handleCreateProduct}
        >
          Create
          {isUploading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Page;
