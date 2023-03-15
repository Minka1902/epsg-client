export const BASE_URL = 'https://michaelscharff-api.herokuapp.com';

export const register = ( password, email ) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
  .then((res) => {
    return _handleResponse(res);
  });
};

export const authorize = ( password, email ) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
  .then(((res) => {
    return _handleResponse(res);
  }))
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then((res) => _handleResponse(res));
}

const _handleResponse = (res) => {
   return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
};
