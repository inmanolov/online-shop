import react, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Store } from "../../utils/Store";
import Link from "next/link";
import data from "../../utils/data";
import Image from "next/image";
import { Button } from "../../components";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";

const ProductScreen = (props) => {
    const { product } = props;
    const { state, dispatch } = useContext(Store);

    const router = useRouter();
    
    if(!product){
        return <div>Product not found</div>
    } 

    const addToCartHandler = async() => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        
        if(data.countInStock < quantity) {
            alert('Sorry out of stock');
            return
        }
        
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');

    };

    return(
        <div>
            <Link href="/">Back to products </Link>
            <div className="grid md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2">
                <Image src={product.image} width={540} height={540} alt={product.name} />
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className="text-lg">{product.name}</h1>
                        </li>
                        <li>category: {product.category}</li>
                        <li>Brand: {product.brand}</li>
                        <li>{product.rating} of {product.numReviews}</li>
                        <li>Description: {product.description}</li>
                    </ul>
                </div>
                <div>
                    <div className="card p-5">
                    <div className="mb-2 flex justify-between">
                            <div>Price</div>
                            <div>$ {product.price}</div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div>Status</div>
                            <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
                        </div>
                        <button className="primary-button w-full" onClick={addToCartHandler}>Add to cart</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export const getServerSideProps = async (context) => {
    const { params } = context;
    const { slug } = params;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        }
    };
}

export default ProductScreen;