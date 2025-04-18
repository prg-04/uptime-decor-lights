"use client";

import { useState } from "react";

export default function PayForm() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/mpesa", {
      method: "POST",
      body: JSON.stringify({ phone, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    alert("Payment initiated. Check your phone.");
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <h1 className="text-2xl">
        Pay with <span className="text-green-600 font-bold">Mpesa</span>
      </h1>
      <form onSubmit={handlePay} className="flex flex-col space-y-5 mt-5">
        <input
          type="text"
          placeholder="Phone (e.g. 0712345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-slate-100 text-center rounded-xl px-4 py-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-slate-100 text-center rounded-xl px-4 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-2xl"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
