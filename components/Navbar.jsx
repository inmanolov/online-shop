import react, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, useSession } from "next-auth/react";
import { DropdownLink } from "../components";

import { Store } from "../utils/Store";

const Navbar = ({ children, title }) => {
    const { status, data: session } = useSession();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
    }, [cart.cartItems]);

    const LogOutLink = (props) => {
        const { href, children, ...rest } = props;
        return(
            <Link href={href} >
                <div {...rest}>{children}</div>
            </Link>
        );
    };

    const logoutClickHandler = () => {
       Cookies.remove('cart');
       dispatch({ type: 'CART_RESET'});
       signOut({ callbackUrl: '/' });
    }

    return(
        <div>
            <Head>
                <title>{title ? title + 'Shop online' : 'Shop online'}</title>
                <meta name="" content=""/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <ToastContainer position="bottom-center" limit={1} />

            <div className="flex flex-col justify-between">
                <header>
                    <nav className="flex h-12 px-4 items-center shadow-md  justify-between">
                        <Link className="text-lg font-bold" href="/">Shop online</Link>
                        <div>
                            <Link href="/cart" className="p-2">Cart 
                                {cartItemsCount > 0 && (
                                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                            {status === 'loading' ? (
                                'Loading'
                            ) : session?.user ? (
                                <Menu as="div" className="relative inline-block">
                                    <Menu.Button className="text-blue-600">
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className="absolute bg-white right-0 w-56 origin-top-right shadow-lg">
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/profile">
                                            Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/order-history">
                                            Order history
                                            </DropdownLink>
                                        </Menu.Item>
                                        {
                                            session.user.isAdmin && (
                                                <Menu.Item>
                                                    <DropdownLink
                                                        className="dropdown-link"
                                                        href="/admin/dashboard"
                                                    >
                                                        Admin Dashboard
                                                    </DropdownLink>
                                                </Menu.Item>
                                            )   
                                        }
                                        <Menu.Item>
                                            <LogOutLink className="dropdown-link" href="/" onClick={logoutClickHandler}>
                                            Logout
                                            </LogOutLink>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : (
                                <Link href="/login" className="p-2">Login</Link>
                            )}
                        </div>
                    </nav>
                </header>
            </div>
        </div>
    );
};

export default Navbar;