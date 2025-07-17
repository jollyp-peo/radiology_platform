export async function authFetch(url, options = {}) {
  const access = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  });

  if (res.status === 401) {
    // Try to refresh the token
    const refresh = localStorage.getItem("refresh");
    const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("token", data.access);

      // Retry original request
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${data.access}`,
        },
      });
    } else {
      // Refresh failed, logout user
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      return;
    }
  }

  return res;
}
