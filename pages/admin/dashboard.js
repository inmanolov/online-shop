import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { getError } from "../../utils/error";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };  

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: ''};           
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, summary: action.payload, error: ''};
        case 'FETCH_FAIL':
            return { ...state, loading:false, error: action.payload};
        default:
            break;
    }
}

const AdminDashboardPage = () => {
    const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
        loading: true,
        summary: { salesData: []},
        error: '',
    });

    // console.log(summary.salesData)

    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/admin/summary');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        }

        fetchData();
    }, []);

    const data = {
        labels: summary.salesData.map((x) => x._id),
        datasets: [
            {
                label: 'Sales',
                backgroundColor: 'rgba(162, 222, 208, 1)',
                data: summary.salesData.map((x) => x.totalSales),
            }
        ]
    };

    // console.log(data);

    return(
        <div className="grid md:grid-cols-4 md:gap-5 min-h-screen">
            <div className="text-blue-500">
                <ul>
                    <li>
                        <Link className="font-bold" href="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/admin/orders">Orders</Link>
                    </li>
                    <li>
                        <Link href="/admin/products">Products</Link>
                    </li>
                    <li>
                        <Link href="/admin/users">Users</Link>
                    </li>
                </ul>
            </div>
            <div className="md:col-span-3">
                <h1 className="mb-4 text-xl">Admin Dashboard</h1>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4">
                            <div className="card m-5 p-5">
                                <p className="text-3xl">$ {summary.ordersPrice}</p>
                                <p>Sales</p>
                                <Link className="text-blue-500" href="/admin/orders">View Sales</Link>
                            </div>
                            <div className="card m-5 p-5">
                                <p className="text-3xl">{summary.ordersCount}</p>
                                <p>Orders</p>
                                <Link className="text-blue-500" href="/admin/orders">View Orders</Link>
                            </div>
                            <div className="card m-5 p-5">
                                <p className="text-3xl">{summary.productsCount}</p>
                                <p>Products</p>
                                <Link className="text-blue-500" href="/admin/orders">View products</Link>
                            </div>
                            <div className="card m-5 p-5">
                                <p className="text-3xl">{summary.usersCount}</p>
                                <p>Users</p>
                                <Link className="text-blue-500" href="/admin/orders">View users</Link>
                            </div>
                        </div>
                        
                        <h2 className="text-xl">Sales Report</h2>
                        <Bar 
                            options={{
                                legend: { display: true, position: 'right' },
                            }}
                            data={data}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

AdminDashboardPage.auth = { adminOnly: true };
export default AdminDashboardPage;