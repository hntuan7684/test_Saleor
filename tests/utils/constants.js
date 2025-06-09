// utils/constants.js
const BASE_URL = "https://zoomprints.com/default-channel";
const MAILINATOR_BASE_URL = "https://www.mailinator.com/v4/public/inboxes.jsp";
const PRODUCTS_URL = "https://zoomprints.com/default-channel/products";
const CART_URL = "https://zoomprints.com/default-channel/cart";
// const LOGIN_URL = "https://mypod.io.vn/default-channel/login";
const LOGIN_URL =
  "https://accounts.mypodsoftware.io.vn/realms/keycloak/protocol/openid-connect/auth?response_type=code&client_id=zoomprints-saleor-client&redirect_uri=https%3A%2F%2Fmypod.io.vn%2Fdefault-channel%2Fauth%2Fkeycloak-callback&scope=openid+profile+email+offline_access&state=eyJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vbXlwb2QuaW8udm4vZGVmYXVsdC1jaGFubmVsL2F1dGgva2V5Y2xvYWstY2FsbGJhY2sifQ%3A1uMHlA%3ALaHL8H1p98HVtcZmV843T3cTsUuqXiWYjJvwswe2mkw";
const ORDERS_URL = "https://zoomprints.com/default-channel/orders";
const SUPPORT_URL = "https://zoomprints.com/default-channel/support";

module.exports = {
  BASE_URL,
  MAILINATOR_BASE_URL,
  PRODUCTS_URL,
  CART_URL,
  LOGIN_URL,
  ORDERS_URL,
  SUPPORT_URL,
};
