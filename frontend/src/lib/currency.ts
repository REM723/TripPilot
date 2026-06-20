const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatInr(amount: number): string {
  return inr.format(amount);
}

// Backend messages spell amounts as "Rs.2000"; re-render those as ₹ with
// Indian digit grouping so every amount on screen is formatted consistently.
export function formatInrInText(text: string): string {
  return text.replace(/Rs\.(\d+)/g, (_, digits) => formatInr(Number(digits)));
}
