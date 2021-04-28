import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleReponse } from "./auth";

export const createCategory = (category, token) => {
  return fetch(`${API}/api/category`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      handleReponse(response) 
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listCategories = () => {
  return fetch(`${API}/api/categories`, { method: "GET" })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const singleCategory = (slug) => {
  return fetch(`${API}/api/category/${slug}`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeCategory = (slug, token) => {
  return fetch(`${API}/api/category/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleReponse(response)
      return response.json();
    })
    .catch((err) => console.log(err));
};
