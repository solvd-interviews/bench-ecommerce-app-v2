"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link'

interface FormData {
  username: string;
  password: string;
}

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: FormData) => console.log(data);

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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign In</h2>
          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="sign-in-username"
                      type="text"
                      required
                      {...register('username', { required: "Username is required" })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="sign-in-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      {...register('password', { required: "Password is required" })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
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

export default SignIn;
