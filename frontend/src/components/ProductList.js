import Product from "./Product";

const ProductLists = ({ products }) => {
  return (
    <div className="grid sm:grid-cols-6 lg:grid-cols-8  sm:content-start gap-2 w-full ">
      {products.map((product, key) => (
        <Product product={product} key={key} />
      ))}
    </div>
  );
};

export default ProductLists;
