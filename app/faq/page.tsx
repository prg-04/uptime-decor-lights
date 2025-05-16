import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Uptime Decor Lights",
  description:
    "Find answers to common questions about orders, shipping, returns, and more.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How long will my order take to arrive?",
      answer:
        "Most orders are processed within 1–2 business days and shipped within 3–7 business days depending on your location.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes! We ship worldwide. Shipping fees and delivery times vary based on the destination.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Visa, MasterCard, PayPal, and mobile money (M-Pesa).",
    },
    {
      question: "Can I return or exchange a product?",
      answer:
        "Yes. We offer returns within 14 days of delivery for unused and undamaged items. Please contact support for return instructions.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can email us at support@uptimedecor.com or use the contact form on our website.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-semibold text-gray-800">
              {faq.question}
            </h2>
            <p className="text-muted-foreground mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
