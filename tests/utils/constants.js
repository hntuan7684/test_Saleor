// utils/constants.js
const BASE_URL = "https://storefront-dev.mypodsoftware.io.vn/us";
const BASE_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us";
const MAILINATOR_BASE_URL = "https://www.mailinator.com/v4/public/inboxes.jsp";
const PRODUCTS_URL =
  "https://storefront-dev.mypodsoftware.io.vn/us/products";
const PRODUCTS_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us/products";
const CART_URL = "https://storefront-dev.mypodsoftware.io.vn/us/cart";
const CART_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us/cart";
const LOGIN_URL =
  "https://accounts.mypodsoftware.io.vn/realms/keycloak/protocol/openid-connect/auth?response_type=code&client_id=zoomprints-saleor-client&redirect_uri=https%3A%2F%2Fstorefront-dev.mypodsoftware.io.vn%2Fus%2Fauth%2Fkeycloak-callback&scope=openid+profile+email+offline_access&state=eyJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vc3RvcmVmcm9udC1kZXYubXlwb2Rzb2Z0d2FyZS5pby52bi91cy9hdXRoL2tleWNsb2FrLWNhbGxiYWNrfQ%3D%3D";
const ORDERS_URL =
  "https://storefront-dev.mypodsoftware.io.vn/us/orders";
const ORDERS_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us/orders";
const SUPPORT_URL =
  "https://storefront-dev.mypodsoftware.io.vn/us/support";
const SUPPORT_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us/support";
const SERVICE_URL =
  "https://storefront-dev.mypodsoftware.io.vn/us/service";
const SERVICE_URL_DEV = "https://storefront-dev.mypodsoftware.io.vn/us/service";
const FORGOTPASSWORD_URL =
  "https://accounts.mypodsoftware.io.vn/realms/keycloak/login-actions/reset-credentials?client_id=zoomprints-saleor-client&tab_id=zsyufFAFsXQ&client_data=eyJydSI6Imh0dHBzOi8vc3RvcmVmcm9udC1kZXYubXlwb2Rzb2Z0d2FyZS5pby52bi91cy9hdXRoL2tleWNsb2FrLWNhbGxiYWNrIiwicnQiOiJjb2RlIiwic3QiOiJleUp5WldScGNtVmpkRlZ5YVNJNkltWjBkSEJ6T2k4dmVtOXZiWEJ5YVc1MGN5NWpiMjB2WkdWbVlYVnNkQzFqYUdGdWJtVnNMMkYxZEdndmEyVjVZMnR2WVdzdFkyRnNiR0poWTJzaWZROjF1T296WTo3UTlZdjVWUlpwdk1RTzU2TzVlWW9jYVpYY0pRVG0xSTJqZHJCdXFXcXNrfQ%3D%3D";

// Environment selector - Changed default to 'dev' for safety
const ENV = process.env.TEST_ENV || 'dev'; // 'prod' or 'dev'

// Dynamic URL selection based on environment
const getBaseUrl = () => ENV === 'dev' ? BASE_URL_DEV : BASE_URL;
const getProductsUrl = () => ENV === 'dev' ? PRODUCTS_URL_DEV : PRODUCTS_URL;
const getCartUrl = () => ENV === 'dev' ? CART_URL_DEV : CART_URL;
const getOrdersUrl = () => ENV === 'dev' ? ORDERS_URL_DEV : ORDERS_URL;
const getSupportUrl = () => ENV === 'dev' ? SUPPORT_URL_DEV : SUPPORT_URL;
const getServiceUrl = () => ENV === 'dev' ? SERVICE_URL_DEV : SERVICE_URL;

module.exports = {
  BASE_URL,
  BASE_URL_DEV,
  MAILINATOR_BASE_URL,
  PRODUCTS_URL,
  PRODUCTS_URL_DEV,
  CART_URL,
  CART_URL_DEV,
  LOGIN_URL,
  ORDERS_URL,
  ORDERS_URL_DEV,
  SUPPORT_URL,
  SUPPORT_URL_DEV,
  SERVICE_URL,
  SERVICE_URL_DEV,
  FORGOTPASSWORD_URL,
  ENV,
  getBaseUrl,
  getProductsUrl,
  getCartUrl,
  getOrdersUrl,
  getSupportUrl,
  getServiceUrl,
};
