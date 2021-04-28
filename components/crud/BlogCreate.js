import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Router, withRouter } from "next/router";
import dynamic from "next/dynamic";
import { isAuth, getCookie } from "../../actions/auth";
import { listCategories } from "../../actions/category";
import { listTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
import { QuillFormats, QuillModules } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";

const BlogCreate = ({ router }) => {
  const blogFromLocalStorage = () => {
    if (typeof window === "undefined") {
      return false;
    } else {
      if (localStorage.getItem("blog")) {
        return JSON.parse(localStorage.getItem("blog"));
      } else {
        return false;
      }
    }
  };

  const [body, setBody] = useState(blogFromLocalStorage());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;

  useEffect(() => {
    initCategories();
    initTags();
    setValues({ ...values, formData: new FormData() });
  }, [router]);

  const initCategories = () => {
    listCategories()
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        }
        setCategories(data);
      })
      .catch((err) => console.log(err));
  };

  const initTags = () => {
    listTags()
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        }
        setTags(data);
      })
      .catch((err) => console.log(err));
  };

  const token = getCookie("token");

  const publishBlog = (e) => {
    e.preventDefault();
    // console.log("Block created");
    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data);
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog title "${data.title}" is created`,
        });
        setCategories([]);
        setTags([]);
        setBody("");
      }
    });
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    // console.log(e);
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleToggleCat = (categoryId) => () => {
    setValues({ ...values, error: "" });
    //return the first index or -1
    const clickedCategory = checkedCategory.indexOf(categoryId);
    const all = [...checkedCategory];
    //if it is -1 push the id in the array
    if (clickedCategory === -1) {
      all.push(categoryId);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setCheckedCategory(all);
    formData.set("categories", all);
  };

  const handleToggleTag = (tagId) => () => {
    setValues({ ...values, error: "" });
    //return the first index or -1
    const clickedTag = checkedTag.indexOf(tagId);
    const all = [...checkedTag];
    //if it is -1 push the id in the array
    if (clickedTag === -1) {
      all.push(tagId);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((cat, index) => (
        <li className="list-unstyled" key={index}>
          <input
            onChange={handleToggleCat(cat._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{cat.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li className="list-unstyled" key={index}>
          <input
            onChange={handleToggleTag(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing ..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />

              <small className="texted-muted col-md-12">Max size: 1MB</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>

          <div className="mt-3">
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogCreate);
