"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      window.location.reload();
      router.replace("/");
      //alert("succesfull sign in");
    } catch (error) {
      //alert("Error sign in");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block lg:w-1/2 bg-blue-500">
        {/* <Image
          src="/bag.png"
          layout="fill"
          objectFit="cover"
          alt="Background"
        /> */}
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link className="hover:underline btn btn-primary" href={"/"}>
            Back to home
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Login</h2>
          <div className="mt-8">
            <div className="mt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="sign-in-email"
                      type="text"
                      required
                      {...register("email", {
                        required: "Email is required",
                      })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="sign-in-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
