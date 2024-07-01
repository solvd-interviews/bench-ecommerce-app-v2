"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { LuXCircle } from "react-icons/lu";
import { toast } from "sonner";

const Page = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [files, setFiles] = useState<any | File[]>(undefined);
  console.log(" files clg", files);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    console.log("handleCreateProduct");

    if (name.length < 3) {
      return toast.error("The name should be greater than 2 characters.");
    }
    if (description.length < 3) {
      return toast.error(
        "The description should be greater than 2 characters."
      );
    }
    if (!price || price < 1) {
      return toast.error("The price should be greater than 0.");
    }
    if (!files || files.length < 1) {
      return toast.error("At least 1 file is required.");
    }
    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", JSON.stringify(price));
    formData.set("imgLength", files.length);
    files.forEach((e: File, index: number) => {
      formData.set("image-" + index, files[index]);
    });
    try {
      const res = await fetch("http://localhost:3000/api/upload/product", {
        method: "post",
        body: formData,
      });
      console.log("res is", res);
      const resJson = await res.json();
      console.log("resJson is", resJson);
    } catch (error) {
      console.log("error is", error);
    }
  };

  return (
    <main>
      <header className="w-full h-20 font-bold text-3xl first-line bg-gray-300 flex justify-around items-center ">
        ADMIN HEADER
      </header>
      <form className="flex flex-col gap-4 m-2">
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
        <input
          type="file"
          multiple
          className="file-input file-input-bordered w-full max-w-xs"
          accept="image/png, image/jpg, image/jpeg"
          onChange={(e) => {
            console.log("onchange: ", e);
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
          className="btn btn-primary mt-2 w-20"
          onClick={handleCreateProduct}
        >
          Create
        </button>
      </form>
      <footer></footer>
    </main>
  );
};

export default Page;
