// src/lib/utils.js
export function jsonRes(data = {}, status = 200) {
  // ensure valid status range to avoid RangeError
  const s = Number.isInteger(status) && status >= 200 && status <= 599 ? status : 500;
  return new Response(JSON.stringify(data), {
    status: s,
    headers: { "Content-Type": "application/json" },
  });
}