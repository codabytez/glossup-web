interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface CustomerUserError {
  field: string[] | null;
  message: string;
}

interface OrderLineItem {
  title: string;
  quantity: number;
  image: string | null;
  variantTitle: string | null;
  price: string;
}

interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  statusUrl: string;
  total: string;
  lineItems: OrderLineItem[];
}

interface CustomerOrdersPage {
  orders: CustomerOrder[];
  hasNextPage: boolean;
  endCursor: string | null;
}

interface OrderAddress {
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
}

interface OrderTracking {
  company: string | null;
  number: string | null;
  url: string | null;
}

interface CustomerOrderDetail extends CustomerOrder {
  subtotal: string;
  shipping: string;
  tax: string;
  shippingAddress: OrderAddress | null;
  tracking: OrderTracking[];
}
