import Product from "./Product";

const ProductLists = ({ products }) => {
  return (
    <div className="grid sm:grid-cols-8 lg:grid-cols-10 sm:content-start gap-2 w-full py-2">
      {products.map((product, key) => (
        <Product product={product} key={key} />
      ))}
    </div>
  );
};

export default ProductLists;
