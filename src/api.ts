export const API_BASE_URL = 'https://kanchara.datacubeglobal.com/api';

const getHeaders = (token?: string, extraHeaders?: Record<string, string>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...extraHeaders
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==========================================
// 1. PUBLIC AUTHENTICATION APIs
// ==========================================

export const sendOtpAPI = async (mobile: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile })
    });
    return await res.json();
  } catch (err) {
    console.warn('sendOtpAPI error:', err);
    return null;
  }
};

export const verifyOtpAPI = async (mobile: string, otp: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, otp })
    });
    return await res.json();
  } catch (err) {
    console.warn('verifyOtpAPI error:', err);
    return null;
  }
};

export const loginWithPasswordAPI = async (mobile: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, password })
    });
    return await res.json();
  } catch (err) {
    console.warn('loginWithPasswordAPI error:', err);
    return null;
  }
};

export const loginWithOtpAPI = async (mobile: string, otp: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login-with-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, otp })
    });
    return await res.json();
  } catch (err) {
    console.warn('loginWithOtpAPI error:', err);
    return null;
  }
};

export const createCustomerAPI = async (customerData: {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  password?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  profile_pic?: string;
  status?: number;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/create-customer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(customerData)
    });
    return await res.json();
  } catch (err) {
    console.warn('createCustomerAPI error:', err);
    return null;
  }
};

// ==========================================
// 2. ENQUIRY & TRACKING APIs (Public)
// ==========================================

export const submitCustomerEnquiry = async (payload: { name: string; email: string; phone: string; message: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/customer-enquiry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('submitCustomerEnquiry error:', err);
    return null;
  }
};

export const submitWholesaleEnquiry = async (payload: { name: string; phone: string; message: string; email: string; company_name: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/wholesale-enquiry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('submitWholesaleEnquiry error:', err);
    return null;
  }
};

export const trackVisitAPI = async (sessionId: string, pageUrl: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/track-visit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ session_id: sessionId, page_url: pageUrl })
    });
    return await res.json();
  } catch (err) {
    console.warn('trackVisitAPI error:', err);
    return null;
  }
};

export const trackCheckoutClickAPI = async (
  sessionIdOrPayload: string | { session_id?: string; cart_id?: string | number },
  cartId?: string | number,
  token?: string
) => {
  try {
    const payload = typeof sessionIdOrPayload === 'object'
      ? sessionIdOrPayload
      : { session_id: sessionIdOrPayload, cart_id: cartId };

    const res = await fetch(`${API_BASE_URL}/checkout-click`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('trackCheckoutClickAPI error:', err);
    return null;
  }
};

// ==========================================
// 3. CATALOG & PRODUCT APIs (Public)
// ==========================================

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api-categories`);
    const data = await res.json();
    return data.categories || data.data || data;
  } catch (err) {
    console.warn('fetchCategories error:', err);
    return null;
  }
};

export const fetchSubCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api-sub-categories`);
    const data = await res.json();
    return data.sub_categories || data.data || data;
  } catch (err) {
    console.warn('fetchSubCategories error:', err);
    return null;
  }
};

export const fetchSubCategoriesByCategoryId = async (id: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api-sub-categories/${id}`);
    const data = await res.json();
    return data.sub_categories || data.data || data;
  } catch (err) {
    console.warn('fetchSubCategoriesByCategoryId error:', err);
    return null;
  }
};

export const fetchProductsFromAPI = async (categoryName?: string, keyword?: string) => {
  try {
    let url = `${API_BASE_URL}/api-products`;
    const params = new URLSearchParams();
    if (categoryName && categoryName !== 'all') params.append('category_name', categoryName);
    if (keyword) params.append('keyword', keyword);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchProductsFromAPI error:', err);
    return null;
  }
};

export const fetchProductDetailsById = async (id: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api-products/${id}`);
    const data = await res.json();
    return data.product || data.data || data;
  } catch (err) {
    console.warn('fetchProductDetailsById error:', err);
    return null;
  }
};

export const fetchProductsByCategoryId = async (categId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products_by_category/${categId}`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchProductsByCategoryId error:', err);
    return null;
  }
};

export const fetchProductsBySubCategoryId = async (subCategId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products_by_SubCategory/${subCategId}`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchProductsBySubCategoryId error:', err);
    return null;
  }
};

export const fetchProductsByBrandId = async (brandId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products_by_Brand/${brandId}`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchProductsByBrandId error:', err);
    return null;
  }
};

export const fetchRandomProducts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/random_products`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchRandomProducts error:', err);
    return null;
  }
};

export const fetchBanners = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/get-banners`);
    const data = await res.json();
    return data.banners || data.data || data;
  } catch (err) {
    console.warn('fetchBanners error:', err);
    return null;
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/featured-prods`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchFeaturedProducts error:', err);
    return null;
  }
};

export const fetchBrands = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/brands`);
    const data = await res.json();
    return data.brands || data.data || data;
  } catch (err) {
    console.warn('fetchBrands error:', err);
    return null;
  }
};

export const fetchTopSellingProducts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/top-selling`);
    const data = await res.json();
    return data.products || data.data || data;
  } catch (err) {
    console.warn('fetchTopSellingProducts error:', err);
    return null;
  }
};

export const fetchCoupons = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/get-coupons`);
    const data = await res.json();
    return data.coupons || data.data || data;
  } catch (err) {
    console.warn('fetchCoupons error:', err);
    return null;
  }
};

export const fetchReturnPolicies = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/return-policies`);
    const data = await res.json();
    return data.policies || data.data || data;
  } catch (err) {
    console.warn('fetchReturnPolicies error:', err);
    return null;
  }
};

export const validateCouponAPI = async (couponCode: string, totalAmount: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/coupon/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ coupon_code: couponCode, total_amount: totalAmount })
    });
    return await res.json();
  } catch (err) {
    console.warn('validateCouponAPI error:', err);
    return null;
  }
};

// ==========================================
// 4. AUTHENTICATED CUSTOMER & PROFILE APIs
// ==========================================

export const fetchShowCustomer = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/show-customer`, {
      headers: getHeaders(token)
    });
    const data = await res.json();
    return data.user || data.customer || data.data || data;
  } catch (err) {
    console.warn('fetchShowCustomer error:', err);
    return null;
  }
};

export const updateCustomerAPI = async (customerData: any, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/update-customer`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(customerData)
    });
    return await res.json();
  } catch (err) {
    console.warn('updateCustomerAPI error:', err);
    return null;
  }
};

export const deleteAccountAPI = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/delete-account`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return await res.json();
  } catch (err) {
    console.warn('deleteAccountAPI error:', err);
    return null;
  }
};

export const logoutAPI = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return await res.json();
  } catch (err) {
    console.warn('logoutAPI error:', err);
    return null;
  }
};

// ==========================================
// 5. WISHLIST & CART APIs (Authenticated)
// ==========================================

export const fetchWishlistAPI = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getHeaders(token)
    });
    const data = await res.json();
    return data.wishlist || data.data || data;
  } catch (err) {
    console.warn('fetchWishlistAPI error:', err);
    return null;
  }
};

export const toggleWishlistAPI = async (productId: string | number, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ product_id: productId })
    });
    return await res.json();
  } catch (err) {
    console.warn('toggleWishlistAPI error:', err);
    return null;
  }
};

export const fetchCartAPI = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders(token)
    });
    const data = await res.json();
    return data.cart || data.data || data;
  } catch (err) {
    console.warn('fetchCartAPI error:', err);
    return null;
  }
};

export const addToCartAPI = async (productId: string | number, quantity: number = 1, options?: any, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ product_id: productId, quantity, options })
    });
    return await res.json();
  } catch (err) {
    console.warn('addToCartAPI error:', err);
    return null;
  }
};

export const removeFromCartAPI = async (productId: string | number, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/remove-item`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ product_id: productId })
    });
    return await res.json();
  } catch (err) {
    console.warn('removeFromCartAPI error:', err);
    return null;
  }
};

export const updateCartCountAPI = async (productId: string | number, count: number, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/update-count`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ product_id: productId, count })
    });
    return await res.json();
  } catch (err) {
    console.warn('updateCartCountAPI error:', err);
    return null;
  }
};

// ==========================================
// 6. DELIVERY ADDRESS APIs (Authenticated)
// ==========================================

export const fetchDeliveryAddressesAPI = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delivery-address`, {
      headers: getHeaders(token)
    });
    const data = await res.json();
    return data.addresses || data.data || data;
  } catch (err) {
    console.warn('fetchDeliveryAddressesAPI error:', err);
    return null;
  }
};

export const addDeliveryAddressAPI = async (addressData: {
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  email?: string;
  address_line2?: string;
  country?: string;
  is_default?: boolean;
}, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delivery-address`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(addressData)
    });
    return await res.json();
  } catch (err) {
    console.warn('addDeliveryAddressAPI error:', err);
    return null;
  }
};

export const updateDeliveryAddressAPI = async (id: string | number, addressData: any, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(addressData)
    });
    return await res.json();
  } catch (err) {
    console.warn('updateDeliveryAddressAPI error:', err);
    return null;
  }
};

export const deleteDeliveryAddressAPI = async (id: string | number, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return await res.json();
  } catch (err) {
    console.warn('deleteDeliveryAddressAPI error:', err);
    return null;
  }
};

// ==========================================
// 7. CHECKOUT, ORDERS & RETURNS APIs
// ==========================================

export const submitCheckoutAPI = async (payload: {
  delivery_state: string;
  coupon_code?: string;
  total_amount: number;
  actual_total_amount?: number;
  session_id?: string;
  payment_method: string;
}, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/checkout`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('submitCheckoutAPI error:', err);
    return null;
  }
};

export const fetchPurchaseHistory = async (token: string) => {
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/purchase/history?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text) return [];
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.orders)) return data.orders;
      if (Array.isArray(data.purchase_history)) return data.purchase_history;
      if (Array.isArray(data.history)) return data.history;
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch (e) {
      return [];
    }
  } catch (err) {
    console.warn('fetchPurchaseHistory error:', err);
    return [];
  }
};

export const createSalesReturnAPI = async (payload: {
  order_id: string | number;
  items: Array<{ product_id: string | number; quantity: number; price: number }>;
  return_reason: string;
  product_condition?: string;
  return_type?: 'refund' | 'replacement';
  remarks?: string;
}, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/sales-return/save`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('createSalesReturnAPI error:', err);
    return null;
  }
};

export const fetchOrderCommentsAPI = async (orderItemId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/order-items/${orderItemId}/comments`);
    const data = await res.json();
    return data.comments || data.data || data;
  } catch (err) {
    console.warn('fetchOrderCommentsAPI error:', err);
    return null;
  }
};

export const addOrderCommentAPI = async (orderItemId: string | number, payload: {
  comment: string;
  rating?: number;
  parent_id?: number;
}, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/order-items/${orderItemId}/comments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('addOrderCommentAPI error:', err);
    return null;
  }
};

// ==========================================
// 8. RAZORPAY PAYMENT GATEWAY APIs
// ==========================================

export const createRazorpayPaymentAPI = async (payload: {
  name: string;
  order_id: string | number;
  phone: string;
  email?: string;
  description?: string;
}, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/razorpay/payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('createRazorpayPaymentAPI error:', err);
    return null;
  }
};

export const verifyRazorpaySuccessAPI = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/razorpay/success`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('verifyRazorpaySuccessAPI error:', err);
    return null;
  }
};

export const reportRazorpayFailedAPI = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  reason?: string;
}, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/razorpay/failed`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('reportRazorpayFailedAPI error:', err);
    return null;
  }
};
