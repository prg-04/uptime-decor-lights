import { NextResponse } from "next/server";
import axios from "axios";

const consumerKey = "DAqL3ynNwUf1x6bZ0ry66VAaV3XsMZT2qbmwWrgTGTnECNdz";
const consumerSecret =
  "XOxE46ARLA7PAHc09rCvJcXjaA3euk7Ffrls2A6QARNXHXQRqYmOAg6x9csvgfyF";
const shortcode = 222111;
const passkey =
  "VrJv3AnjLiFHORhiurR2uzRfMjeGQf9o7K+7E44BRKxTf4hTMfuMfYfb9cahqdRLQO9B3QTWNG44tKNm0lZUicZNSmxwDU0cTE/kb5LO61rFTbJOt+yQlF7UB5ullZiSgxOh14g+sSPwFcydcVkifSgT8B17mCeZ/kg2dsCXICYZVAtRDz5TzIhJgQaLb37gqcdI6/UgopGwasEx/w477BL47oJSBlyJoRBEO+gcFmBe5OZwwNz/jm3IZoavusiOHljwa6PVaR5E9oOJsZLIGl9RimHu7aH9IuFVxirW1AO8u3CEkq8W7zfUm5rUAPw8lCGsM2UwA1ddj00CGfmiRg==";

const getToken = async (): Promise<string> => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return data.access_token;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body.phone?.substring(1); // remove leading 0
    const amount = body.amount;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .substring(0, 14); // format to YYYYMMDDHHMMSS

    const password = Buffer.from(shortcode + passkey + timestamp).toString(
      "base64"
    );

    const token = await getToken();

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: `254${phone}`,
      PartyB: shortcode,
      PhoneNumber: `254${phone}`,
      CallBackURL: "https://your-domain.com/api/mpesa/callback", // update this
      AccountReference: "2104651",
      TransactionDesc: "Testing stk push",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("MPESA ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
