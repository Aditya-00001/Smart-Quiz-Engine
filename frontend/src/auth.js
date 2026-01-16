const BaseURL = "http://localhost:8000";

export async function signup(email,password) {
  const res = await fetch(`${BaseURL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function login(email,password) {
  const res = await fetch(`${BaseURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}
