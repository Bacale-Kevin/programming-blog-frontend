import fetch from "isomorphic-fetch";
import queryString from "query-string";
import { API } from "../config";
import { isAuth, handleReponse } from "./auth";

export const createBlog = (blog, token) => {
  let createBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndPoint = `${API}/api/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndPoint = `${API}/api/user/blog`;
  }
  return fetch(`${createBlogEndPoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      //! The data we are sending is a form data since it contains an image and not application/json
      //   "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    //beacuse we are sending a form data we don't need to JSON.stringify the data in a json format
    body: blog,
  })
    .then((response) => {
      handleReponse(response)
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listAllBlogsCategoriesTags = () => {
  return fetch(`${API}/api/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      //! The data we are sending is a form data since it contains an image and not application/json
      //   "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const singleBlog = (slug) => {
  return fetch(`${API}/api/blog/${slug}`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return console.log(err);
    });
};

export const listRelated = (blog) => {
  return fetch(`${API}/api/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      //! The data we are sending is a form data since it contains an image and not application/json
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = (username) => {
  let listBlogsEndPoint;

  if (username) {
    listBlogsEndPoint = `${API}/api/${username}/blogs`;
  } else {
    listBlogsEndPoint = `${API}/api/blogs`;
  }

  return fetch(`${listBlogsEndPoint}`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return console.log(err);
    });
};

export const removeBlog = (slug, token) => {
  let deleteBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndPoint = `${API}/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogEndPoint = `${API}/api/user/blog/${slug}`;
  }

  return fetch(`${deleteBlogEndPoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      //! The data we are sending is a form data since it contains an image and not application/json
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

export const updateBlog = (blog, token, slug) => {
  let updateBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndPoint = `${API}/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndPoint = `${API}/api/user/blog/${slug}`;
  }
  return fetch(`${updateBlogEndPoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      //! The data we are sending is a form data since it contains an image and not application/json
      //   "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    //beacuse we are sending a form data we don't need to JSON.stringify the data in a json format
    body: blog,
  })
    .then((response) => {
      handleReponse(response)
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listSearch = (params) => {
  console.log("search params", params);
  let query = queryString.stringify(params);
  console.log("query params", query);
  return fetch(`${API}/api/blogs/search?${query}`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return console.log(err);
    });
};
