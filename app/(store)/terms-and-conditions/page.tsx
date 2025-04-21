// app/terms-and-conditions/page.tsx
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Terms and Conditions - Uptime Decor Lights",
  description: "Review the terms and conditions of using Uptime Decor Lights.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4">Effective Date: [Insert Date]</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Company Information
      </h2>
      <p>
        Uptime Decor Lights is an interior lighting brand based in Nairobi,
        Kenya. Our website address is:{" "}
        <Link
          href="https://uptimedecorlights.com"
          className="underline text-blue-600"
        >
          https://uptimedecorlights.com
        </Link>
        . For questions, please contact us at{" "}
        <strong className="underline">uptimeelectricals@gmail.com</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Our Website</h2>
      <p>You agree to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Use our website for lawful purposes only.</li>
        <li>Not misuse or attempt to disrupt our website’s functionality.</li>
        <li>
          Not reproduce, distribute, or exploit any content without our written
          permission.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Products and Pricing
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>All product prices are listed in Kenyan Shillings (KES).</li>
        <li>Prices may change without prior notice.</li>
        <li>
          We strive to ensure that product descriptions and prices are accurate,
          but we do not guarantee error-free listings.
        </li>
        <li>
          Product availability is subject to stock and may change at any time.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Ordering and Payment
      </h2>
      <p>
        Orders are processed after payment confirmation. We accept{" "}
        <strong>M-Pesa</strong>, <strong>Visa</strong>,{" "}
        <strong>MasterCard</strong>, and other listed payment options. Once an
        order is placed, you will receive a confirmation via email or SMS.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Delivery and Shipping
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Delivery charges are based on your{" "}
          <strong>location and distance</strong> from our distribution point.
        </li>
        <li>
          Estimated delivery time is <strong>1–5 business days</strong>{" "}
          depending on location.
        </li>
        <li>
          We are not responsible for delays caused by courier services, weather,
          or other external factors.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Returns and Refunds
      </h2>
      <p>We accept returns under the following conditions:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          The return is requested <strong>within 7 days</strong> of delivery.
        </li>
        <li>
          The item is <strong>unused</strong>, in its{" "}
          <strong>original packaging</strong>, and in{" "}
          <strong>resellable condition</strong>.
        </li>
        <li>
          Refunds are issued once the returned item is inspected and approved.
        </li>
      </ul>
      <p>
        <strong>Non-refundable items include:</strong>
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Items damaged after delivery.</li>
        <li>Sale or clearance items.</li>
      </ul>
      <p>
        To initiate a return, contact us at [your email or phone number] with
        your order number.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Account Registration
      </h2>
      <p>
        You may register for an account to track orders and manage personal
        preferences. You are responsible for maintaining the confidentiality of
        your login information. We may suspend or terminate accounts that
        violate our policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Privacy and Data Protection
      </h2>
      <p>
        We value your privacy. Your personal information is processed in
        accordance with our{" "}
        <a href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Intellectual Property
      </h2>
      <p>
        All content on this site (including logos, images, text, and product
        designs) is the property of Uptime Decor Lights or its content providers
        and is protected by copyright and trademark laws.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Limitation of Liability
      </h2>
      <p>
        We are not liable for any indirect or incidental damages arising from
        the use of our website or products. This includes delays or failure to
        deliver caused by events beyond our control.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">11. Governing Law</h2>
      <p>
        These Terms are governed by and interpreted in accordance with the laws
        of Kenya.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">12. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be
        posted on this page with an updated effective date. Continued use of the
        website after changes constitutes acceptance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">13. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at:</p>
      <ul className="list-disc list-inside">
        <li>Email: uptimeelectricals@gmail.com</li>
        <li>Phone: +254 706969085</li>
      </ul>
    </main>
  );
}
