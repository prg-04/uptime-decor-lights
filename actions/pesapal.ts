"use server";

const getAccessToken = async () => {
  const response = await fetch(process.env.PESAPAL_AUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Pesapal");
  }

  const data = await response.json();
  return data.token;
};

const registerIPN = async (token: string) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL!;
  const response = await fetch(process.env.PESAPAL_IPN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: `${url}`,
      ipn_notification_type: "POST",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to register IPN URL with Pesapal");
  }

  const data = await response.json();
  return data.ipn_id;
};

const submitOrderRequest = async (
  token: string,
  ipn_id: string,
  orderData: {
    id: string;
    amount: number;
    description: string;
    email: string;
    firstName: string;
    // lastName: string;
  }
) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL!;
  const response = await fetch(process.env.PESAPAL_SUBMIT_ORDER_REQ_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: orderData.id,
      currency: "KES",
      amount: orderData.amount,
      description: orderData.description,
      callback_url: `${url}/success?orderNumber=${orderData.id}`,
      notification_id: ipn_id,
      billing_address: {
        email_address: orderData.email,
        country_code: "KE",
        first_name: orderData.firstName,
        // last_name: orderData.lastName,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Order submission failed: ${err}`);
  }

  const data = await response.json();
  return data;
};

export const initiatePesapalPayment = async (orderData: {
  id: string;
  amount: number;
  description: string;
  email: string;
  firstName: string;
  // lastName: string;
}) => {
  try {
    const token = await getAccessToken();
    const ipn_id = await registerIPN(token);
    const order = await submitOrderRequest(token, ipn_id, orderData);
    return order;
  } catch (error: Error | unknown) {
    console.error("Pesapal Integration Error:", error);
    throw new Error("Payment initiation failed. Please try again.");
  }
};

// ✅ NEW: Fetch transaction details including phone number
export const getPesapalTransactionDetails = async (orderTrackingId: string) => {
  const token = await getAccessToken();

  const url = process.env.PESAPAL_GET_TRANSACTION_STATUS_URL!;

  const response = await fetch(`${url}?orderTrackingId=${orderTrackingId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transaction details from Pesapal");
  }

  const data = await response.json();

  // `data.phone_number` will be available if the transaction was via STK Push
  return {
    status: data.status,
    payment_method: data.payment_method,
    phone_number: data.phone_number,
    amount: data.amount,
    created_date: data.created_date,
    confirmation_code: data.confirmation_code,
  };
};

export async function getTransactionStatus(orderTrackingId: string) {
  const token = await getAccessToken();
  const url = process.env.PESAPAL_GET_TRANSACTION_STATUS_URL!;

  const response = await fetch(`${url}?orderTrackingId=${orderTrackingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transaction status from Pesapal");
  }

  const data = await response.json();
  console.log("Transaction Status Response:", data);
  return data;
}
