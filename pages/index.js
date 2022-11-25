import Image from 'next/image'
import data from '../utils/data';
import Link from 'next/link';
import { ProductItem } from '../components';
import { Button } from '../components';
import db from '../utils/db';
import Product from '../models/Product';
import { Store } from '../utils/Store';
import axios from 'axios';
import { useContext } from 'react';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async(product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    
    if(data.countInStock < quantity) {
        alert('Sorry out of stock');
        return
    }
    
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

};

  return (
    <div className="container m-auto mt-4 px-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:grid-cols-3">
        {products.map((product, i) => 
        <ProductItem
          key={i}
          product={product}
          addToCartHandler={addToCartHandler}
        /> )}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    }
  }
}
