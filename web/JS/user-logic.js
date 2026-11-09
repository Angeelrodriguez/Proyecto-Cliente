export async function signIn(email, password) {
  const resp = await fetch('/Proyecto_Cliente/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'login', email, password })
  });

  let data = null;
  try { data = await resp.json(); } catch (e) { /* sin JSON */ }

  if (!resp.ok || !data || !data.ok) {
    throw new Error((data && data.error) || 'No se pudo iniciar sesión');
  }
  return data;   // { ok, id, firstName, lastName, email }
}

