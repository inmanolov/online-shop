import react from "react";
import Link from "next/link";
import { Button } from ".";

const ProductItem = ({ product, addToCartHandler }) => {
    return (
        <div className="card flex flex-col mr-4 border rounded">
            <Link href={`/product/${product.slug}`}>
                <img 
                    src={product.image}
                    alt={product.name}
                    className="rounded shadow"
                />
            </Link>
            
            <div className="flex flex-col items-center justify-center p-4">
                <Link className="" href={`/product-details/${product.slug}`} >
                    <h2>{product.name}</h2>
                </Link>
                <p>{product.brand}</p>
                <p>$ {product.price}</p>
                <Button
                    clas="primary-button border w-full"
                    name="Add to cart"
                    clickHandler={() => addToCartHandler(product)}
                >
                </Button>
            </div>
        </div>
    );
};

export default ProductItem;