import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { getError } from "../../utils/error";
import Link from "next/link";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: ''};           
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, orders: action.payload, error: ''};
        case 'FETCH_FAIL':
            return { ...state, loading:false, error: action.payload};
        default:
            break;
    }
};

const AdminOrdersPage = () => {
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: '',
    });

    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/admin/orders');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        }

        fetchData();
    }, []);

    return (
        <div className="grid md:grid-cols-4 md:gap-5"> 
            <div className="text-blue-500">
                <ul>
                    <li>
                    <Link href="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li>
                    <Link className="font-bold" href="/admin/orders">
                        Orders
                    </Link>
                    </li>
                    <li>
                    <Link href="/admin/products">Products</Link>
                    </li>
                    <li>
                    <Link href="/admin/users">Users</Link>
                    </li>
                </ul>
            </div>
            <div className="overflow-x-auto md:col-span-3">
            <h1 className="mb-4 text-xl">Admin Orders</h1>
            {loading ? (
            <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b">
                        <tr>
                            <th className="px-5 text-left">ID</th>
                            <th className="p-5 text-left">USER</th>
                            <th className="p-5 text-left">DATE</th>
                            <th className="p-5 text-left">TOTAL</th>
                            <th className="p-5 text-left">PAID</th>
                            <th className="p-5 text-left">DELIVERED</th>
                            <th className="p-5 text-left">ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr className="border-b" key={order._id}>
                                    <td className="group p-5 z-0 hover:text-blue-600">{order._id.substring(20, 24)}
                                        <td className="absolute pr-4 z-10 text-blue-500 hidden group-hover:block">{order._id}</td>
                                    </td>
                                    <td className="p-5">
                                        {order.user ? order.user.name : 'DELETED USER'}
                                    </td>
                                    <td className="p-5">
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className="p-5">${order.totalPrice}</td>
                                    <td className="p-5">
                                        {order.isPaid
                                        ? `${order.paidAt.substring(0, 10)}`
                                        : 'not paid'}
                                    </td>
                                    <td className="p-5">
                                        {order.isDelivered
                                        ? `${order.deliveredAt.substring(0, 10)}`
                                        : 'not delivered'}
                                    </td>
                                    <td className="p-5 text-blue-500">
                                        <Link href={`/order/${order._id}`}>
                                        Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

AdminOrdersPage.auth = { adminOnly: true };
export default AdminOrdersPage;