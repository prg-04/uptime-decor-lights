import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Uptime Decor Lights",
  description:
    "Review our shipping policy including turnaround times, rates, and backorder details.",
};

export default function ShippingInfoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Shipping Policy</h1>

      <section className="space-y-8 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Turnaround</h2>
          <p>
            All orders within Nairobi and its environs will be shipped within
            24–48 hours between Monday and Friday, 8 am–6 pm. Orders outside
            Nairobi but within Kenya will be shipped within 2–3 working days.
            International orders are shipped within 3–5 days. Before your
            package is dropped off, you will be notified by a member of the
            Uptime Decor Lights team.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Shipping Rates
          </h2>
          <p>
            The rates charged for shipping are based on your region/geographical
            location. Before the final checkout page, you will see the total
            shipping cost and can decide whether or not to place your order.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">Back Orders</h2>
          <p>
            If an item goes on back order, we will ship the in-stock portion of
            your order immediately. Once the backordered item becomes available,
            we will ship it at no additional shipping or handling charge.
          </p>
        </div>
      </section>
    </main>
  );
}
