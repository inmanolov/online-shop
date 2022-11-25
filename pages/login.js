import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/router";

const Login = () => {
    const { data: session } = useSession();
    const { handleSubmit, register, formState: { errors } } = useForm();

    const router = useRouter();
    const { redirect } = router.query; 

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);

    const submitFormHandler = async ({ email, password }) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(getError(err));
        }
    }
    return(
        <div className="">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitFormHandler)}>
                <h1 className="mb-4 text-xl">Login</h1>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        autoFocus 
                        type="email" 
                        className="w-full"
                        {...register('email', { required: 'Please enter email', pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                            message: 'Please enter valid email address'
                        }})}
                    ></input>
                    {errors.email && <div className="text-red-500">{errors.email.message}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        autoFocus 
                        type="password" 
                        className="w-full"
                        {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'Password must be more than 5 chars.' },
                          })}
                    ></input>
                    {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                </div>
                <div className="mb-4">
                    <button className="primary-button">Login</button>
                </div>
                <div className="mb-4">
                    Don&apos;t have an account? &nbsp;
                    <Link href="register" className="underline hover:text-blue-400">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;