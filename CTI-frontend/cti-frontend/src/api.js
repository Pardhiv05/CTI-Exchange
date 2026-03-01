const BASE = "http://localhost:8000";

const req = (path, options = {}) =>
  fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  }).then(r => r.json());

export const getStats      = ()      => req("/stats/");
export const getIoC        = (id)    => req(`/iocs/${id}`);
export const checkIoC      = (value) => req(`/iocs/check/${encodeURIComponent(value)}`);
export const submitIoC     = (data)  => req("/iocs/submit",  { method: "POST", body: JSON.stringify(data) });
export const voteOnIoC     = (data)  => req("/iocs/vote",    { method: "POST", body: JSON.stringify(data) });
export const addMember     = (data)  => req("/members/add",  { method: "POST", body: JSON.stringify(data) });
export const getReputation = (addr)  => req(`/members/${addr}/reputation`);
