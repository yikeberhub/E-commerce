const backendDomain = process.env.REACT_APP_API_URL; 
console.log('backend domain is',backendDomain);

const SummaryApi = {
  home: {
    url: `${backendDomain}products/`,
  },
  getUser: {
    url: `${backendDomain}users/get-user/`,
    method: "post",
  },
  signUp: {
    url: `${backendDomain}users/register/`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}users/token/`,
    method: "post",
  },
  current_user: {
    url: `${backendDomain}users/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomain}users/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomain}users/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}users/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomain}products/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomain}products/`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}products/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomain}products/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomain}products/category-product`,
    method: "post",
  },
  productDetail: {
    url: `${backendDomain}products`,
    method: "get",
  },
  fetchCart: {
    url: `${backendDomain}cart/`,
    method: "get",
  },
  addToCartProduct: {
    url: `${backendDomain}cart/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomain}cart/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomain}cart/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomain}cart/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomain}cart/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomain}products/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomain}products/filter-product`,
    method: "post",
  },
};

export default SummaryApi;
