import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleReponse } from "./auth";

export const createTag = (tag, token) => {
  return fetch(`${API}/api/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  })
    .then((response) => {
      handleReponse(response)
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listTags = () => {
  return fetch(`${API}/api/tags`, { method: "GET" })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const singleTag = (slug) => {
  return fetch(`${API}/api/tag/${slug}`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeTag = (slug, token) => {
  return fetch(`${API}/api/tag/${slug}`, {
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
