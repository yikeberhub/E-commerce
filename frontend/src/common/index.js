const backendDomin = "http://localhost:8000";

const SummaryApi = {
  home: {
    url: `${backendDomin}/products/`,
  },
  getUser: {
    url: `${backendDomin}/users/get-user/`,
    method: "post",
  },

  signUp: {
    url: `${backendDomin}/users/register/`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/users/token/`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/users/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/users/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/users/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/users/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomin}/products/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/products/`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/products/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomin}/products/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/products/category-product`,
    method: "post",
  },
  productDetail: {
    url: `${backendDomin}/products`,
    method: "get",
  },
  fetchCart: {
    url: `${backendDomin}/cart/`,
    method: "get",
  },
  addToCartProduct: {
    url: `${backendDomin}/cart/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomin}/cart/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/cart/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/cart/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/cart/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/products/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/products/filter-product`,
    method: "post",
  },
};

export default SummaryApi;
