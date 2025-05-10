export async function sendOrderToN8N(order: any) {
  try {
    const res = await fetch(
      "https://neuralworks.app.n8n.cloud/webhook/processing-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    if (!res.ok) throw new Error("Failed to notify n8n");
    return res.json();
  } catch (err) {
    console.error("n8n webhook error:", err);
  }
}
