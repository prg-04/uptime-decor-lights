import { sanityFetch } from "../live";
import { CouponCode } from "./couponCodes";
import { defineQuery } from "next-sanity";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
        *[
            _type == "sale"
            && isActive == true
            && couponCode == $couponCode  
            ] | order(validFrom desc)[0]
        `);

  try {
    const sale = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_QUERY,
      params: { couponCode },
    });
    return sale ? sale.data : null;
  } catch (error) {
    console.error("Error fetching active sale by coupon code:", error);
    return null;
  }
};
