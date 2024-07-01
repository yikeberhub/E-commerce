const backendDomin = "http://localhost:8000";

const SummaryApi = {
  home: {
    url: `${backendDomin}/shop/`,
  },
  signUP: {
    url: `${backendDomin}/shop/signup/`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/shop/signin/`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/shop/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/shop/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/shop/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/shop/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomin}/shop/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/shop/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/shop/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomin}/shop/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/shop/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomin}/shop/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomin}/shop/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomin}/shop/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/shop/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/shop/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/shop/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/shop/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/shop/filter-product`,
    method: "post",
  },
};

export default SummaryApi;
