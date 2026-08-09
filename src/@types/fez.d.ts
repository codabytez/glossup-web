// ── Auth ──────────────────────────────────────────────────────────────────────

interface FezAuthResponse {
  status: "Success" | "Error";
  description: string;
  authDetails: {
    authToken: string;
    expireToken: string; // "YYYY-MM-DD HH:mm:ss"
  };
  states: string[];
  userDetails: {
    twoFA: number;
    userEmail: string;
    userID: string;
    role: string;
    "Full Name": string;
    Username: string;
    subOrganization: string | null;
    tempPassword: boolean;
  };
  orgDetails: {
    "secret-key": string;
    "Org Full Name": string;
    signedTerms: number;
    orgId: number;
    orgCode: string;
    orgAddress: string;
    orgPhone: string;
    orgBusinessType: string;
    orgLogo: string | null;
    orgEmail: string;
    referralCode: string;
    orgState: string;
    isMultiTenant: number;
    canPayOffline: number;
    multiTenantToken: string | null;
    emailNotification: number;
    smsNotification: number;
    appNotification: number;
    canViewInvoice: boolean;
    feedbackContext: {
      canAddFeedback: boolean;
      deliveryType: string;
    };
  };
  platformIntegrations: unknown[];
  webhooks: unknown[];
  subOrganizations: unknown[];
}

// ── Orders ────────────────────────────────────────────────────────────────────

interface FezCreateOrderPayload {
  recipientAddress: string;
  recipientState: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  uniqueID: string;
  BatchID: string;
  recipientAlternatePhone?: string;
  CustToken?: string;
  itemDescription?: string;
  additionalDetails?: string;
  valueOfItem: string;
  weight: number;
  pickUpState?: string;
  pickUpAddress?: string;
  pickUpDate?: string;
  waybillNumber?: string;
  isItemCod?: boolean;
  cashOnDeliveryAmount?: number;
  fragile?: boolean;
  lockerID?: string;
  thirdparty?: boolean;
  senderName?: string;
  senderAddress?: string;
  senderPhone?: string;
}

interface FezUpdateOrderPayload {
  orderNo: string;
  recipientAddress?: string;
  recipientState?: string;
  recipientName?: string;
  recipientPhone?: string;
}

interface FezUpdateOrderResponse {
  status: "Success" | "Error";
  description: string;
  Response: Record<string, string>; // { [orderNo]: "Order Successfully Updated" }
}

interface FezCancelOrderPayload {
  orderNo: string;
  reason: string;
}

interface FezCancelOrderResponse {
  status: "Success" | "Error";
  description: string;
}

interface FezSearchOrdersPayload {
  startDate: string;
  endDate: string;
  page: number;
  orderNo?: string;
  recipientName?: string;
  recipientPhone?: string;
  orderStatus?: "Pending Pick-Up" | "Picked-Up" | "Dispatched" | "Delivered" | "Returned";
  OrgRep?: string;
}

interface FezSearchOrderItem {
  orderNo: string;
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientPhone: string;
  orderStatus: string;
  statusDescription: string | null;
  cost: string;
  createdBy: string;
  OrgRep: string;
  orderDate: string;
  pickUpDate: string;
  dispatchDate: string | null;
  deliveryDate: string | null;
  returnReason: string | null;
  returnDate: string | null;
}

interface FezSearchOrdersResponse {
  status: "Success" | "Error";
  description: string;
  orders: {
    current_page: number;
    data: FezSearchOrderItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface FezTrackHistoryItem {
  orderStatus: string;
  statusCreationDate: string;
  statusDescription: string;
}

interface FezTrackOrderResponse {
  status: "Success" | "Error";
  description: string;
  order: {
    orderNo: string;
    orderStatus: string;
    recipientAddress: string;
    recipientName: string;
    senderAddress: string;
    senderName: string;
    recipientState: string;
    createdAt: string;
    timezone: string;
    proofOfDelivery: string | null;
  };
  history: FezTrackHistoryItem[];
}

interface FezManifestUrlResponse {
  status: "Success" | "Error";
  description: string;
  data: { url: string };
}

interface FezStatsWithDateRangePayload {
  startDate: string;
  endDate: string;
}

interface FezStatsWithDateRangeOrderItem {
  orderNo: string;
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientPhone: string;
  orderStatus: string;
  statusDescription: string | null;
  cost: string;
  createdBy: string;
  OrgRep: string;
  pickUpDate: string;
  dispatchDate: string | null;
  deliveryDate: string | null;
  returnDate: string | null;
  dropZoneName: string | null;
  returnReason: string | null;
}

interface FezStatsWithDateRangeResponse {
  status: "Success" | "Error";
  description: string;
  orderDetails: FezStatsWithDateRangeOrderItem[];
}

interface FezCreateOrderResponse {
  status: "Success" | "Error";
  description: string;
  orderNos: Record<string, string>; // { [uniqueID]: orderNumber }
}

interface FezManifest {
  orderNo: string;
  requestType: string;
  pickUpState: string;
  dropOffState: string;
  pickUpZone: string;
  dropOffZone: string;
  displayZone: boolean;
  PickUpHub: string;
  DropOffHub: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  description: string;
  sendersName: string;
  fragile: boolean;
}

interface FezOrderDetail {
  id: number;
  clientAddress: string;
  orderNo: string;
  delivery_OTP: string | null;
  pickUpDate: string | null;
  quantity: number;
  dispatchDate: string | null;
  recipientName: string;
  recipientAddress: string;
  recipientEmail: string | null;
  recipient_phone: string;
  recipientPhone: string;
  itemDescription: string;
  statusDescription: string | null;
  orderStatus: string;
  deliveryDate: string | null;
  paymentMode: string | null;
  paymentStatus: string;
  cost: string;
  dropZoneName: string;
  returnReason: string | null;
  returnDate: string | null;
  recievedBySignature: string | null;
  additionalNote: string | null;
  orderVerified: string;
  thirdparty: string | null;
  thirdparty_sendersName: string | null;
  thirdparty_sendersPhone: string | null;
  recipientState: string;
  senderState: string | null;
  created_at: string;
  recipientAlternatePhone: string | null;
  createdBy: string;
  OrgRep: string;
  orderDate: string;
  weight: string;
  sub_organization_id: string | null;
  manifest: FezManifest;
  organizationUser: {
    fullname: string;
    user_id: string;
  };
  subOrganization: string | null;
  cps: string | null;
  currency: string;
  currencySymbol: string;
  client: {
    id: number;
    clientId: string;
    fullName: string;
    address: string;
    phone: string;
    email: string;
    status: string;
    type: string;
    logo: string;
    businessType: {
      id: number;
      name: string;
    };
  };
  manifest_print_out_url: string | null;
  is_item_cod: number;
  cod_amount: string | null;
  insured: boolean;
  insurance_status: string;
  timezone: string;
}

interface FezGetOrderResponse {
  status: "Success" | "Error";
  description: string;
  orderDetails: FezOrderDetail[];
}

// ── Delivery Cost & Estimates ─────────────────────────────────────────────────

interface FezDeliveryCostPayload {
  state?: string;
  pickUpState?: string;
  weight?: number;
  locker?: boolean;
}

interface FezDeliveryCostResponse {
  status: "Success" | "Error";
  description: string;
  cost: {
    state: string;
    cost: number;
  };
  vat: {
    vatAmount: number;
    vatPercent: string;
  };
  totalCost: number;
}

interface FezDeliveryTimeEstimatePayload {
  delivery_type: "import" | "export" | "local";
  pick_up_state?: string;
  drop_off_state?: string;
}

interface FezDeliveryTimeEstimateResponse {
  status: "Success" | "Error";
  description: string;
  data: { eta: string };
}

interface FezState {
  id: number;
  state: string;
}

interface FezStatesResponse {
  status: "Success" | "Error";
  description: string;
  states: FezState[];
}

// ── Webhook ───────────────────────────────────────────────────────────────────

interface FezWebhookPayload {
  orderNumber: string;
  status: string;
}

// ── Change Password ───────────────────────────────────────────────────────────

interface FezChangePasswordPayload {
  user_id: string;
  oldPassword: string;
  newPassword: string;
}

interface FezChangePasswordResponse {
  status: "Success" | "Error";
  description: string;
}

// ── Generic error ─────────────────────────────────────────────────────────────

interface FezErrorResponse {
  status: "Error";
  description: string;
}
