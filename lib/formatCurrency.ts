export function formatCurrency(
  amount: number,
  currencyCode: string = "KES"
): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Invalid currency code:", currencyCode, error);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
