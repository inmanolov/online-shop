import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import axios from "axios";

const Register = () => {
    const { data: session } = useSession();
    const { handleSubmit, register, getValues, formState: { errors } } = useForm();

    const router = useRouter();
    const { redirect } = router.query; 

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);

    const submitFormHandler = async ({ name, email, password }) => {

        try {
            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            });

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(getError(error));
        }
    }

    return(
        <div className="">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitFormHandler)}>
                <h1 className="mb-4 text-xl">Register</h1>

                <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="w-full"
                    id="name"
                    autoFocus
                    {...register('name', {
                    required: 'Please enter name',
                    })}
                />
                {errors.name && (
                    <div className="text-red-500">{errors.name.message}</div>
                )}
                </div>

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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className="w-full"
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword', {
                        required: 'Please enter confirm password',
                        validate: (value) => value === getValues('password'),
                        minLength: {
                            value: 6,
                            message: 'confirm password is more than 5 chars',
                        },
                        })}
                    />
                    {errors.confirmPassword && (
                        <div className="text-red-500 ">
                        {errors.confirmPassword.message}
                        </div>
                    )}
                    {errors.confirmPassword &&
                        errors.confirmPassword.type === 'validate' && (
                        <div className="text-red-500 ">Password do not match</div>
                        )}
                    </div>

                <div className="mb-4">
                    <button className="primary-button">Register</button>
                </div>
                <div className="mb-4">
                    Already have an account? &nbsp;
                    <Link href="login" className="underline hover:text-blue-400">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;