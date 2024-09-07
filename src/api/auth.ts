import axiosInstance from "../hooks/axiosInstance";

export const signInAPI = (username: string, password: string) => {
  return axiosInstance.post(`/oauth/token`, new URLSearchParams({
    client_id: 'core_client',
    grant_type: 'password',
    client_secret: 'secret',
    username: username,
    password: password,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic Y29yZV9jbGllbnQ6c2VjcmV0'
    }
  });
}