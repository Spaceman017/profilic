/**
 * Client helper used by the dashboard UI.
 * - fetchUserPortfolio(): GET /api/portfolio to retrieve existing portfolio for the logged-in user.
 * - createOrUpdatePortfolio(formData): POST /api/portfolio to create or update the user's portfolio.
 *
 * Usage (client-side):
 *
 * import { fetchUserPortfolio, createOrUpdatePortfolio } from './portfolioClientHelper';
 *
 * useEffect(() => {
 *   const load = async () => {
 *     const { ok, portfolio } = await fetchUserPortfolio();
 *     if (ok) setFormState(portfolio);
 *   };
 *   load();
 * }, []);
 *
 * On submit:
 * const result = await createOrUpdatePortfolio(formData);
 * if (result.ok) showModal(result.link);
 */

export async function fetchUserPortfolio() {
  try {
    const res = await fetch('/api/portfolio', { method: 'GET', credentials: 'same-origin' });
    const data = await res.json();
    if (res.ok) {
      return { ok: true, portfolio: data.portfolio };
    } else {
      return { ok: false, message: data.message || 'No portfolio' };
    }
  } catch (err) {
    console.error(err);
    return { ok: false, message: err.message || 'Error' };
  }
}

export async function createOrUpdatePortfolio(formData) {
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (res.ok) {
      return { ok: true, link: data.link, slug: data.slug, portfolio: data.portfolio };
    } else {
      return { ok: false, message: data.message || 'Failed' };
    }
  } catch (err) {
    console.error(err);
    return { ok: false, message: err.message || 'Error' };
  }
}
