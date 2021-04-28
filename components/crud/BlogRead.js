import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Router } from "next/router";
import moment from "moment";
import { isAuth, getCookie } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";

const BlogRead = ({username}) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog ?");
    if (answer) {
      removeBlog(slug, token).then((data) => {
        if (data.error) {
          setMessage("Blog could not be deleted");
        } else {
          setMessage(data.message);
          //refresh the list of blogs
          loadBlogs();
        }
      });
    }
  };

  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className=" ml-2 btn btn-sm btn-warning">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="btn btn-sm btn-warning ml-2">Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, index) => (
      <div key={index} className="pb-5">
        <h3>{blog.title}</h3>
        <p className="mark">
          Written by {blog.postedBy.name} | Puslished{" "}
          {moment(blog.updatedAt).fromNow()}
        </p>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => deleteConfirm(blog.slug)}
        >
          Delete
        </button>
        {showUpdateButton(blog)}
      </div>
    ));
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </>
  );
};

export default BlogRead;
