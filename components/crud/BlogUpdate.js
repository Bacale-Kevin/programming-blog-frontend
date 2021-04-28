import React, { useState, useEffect } from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import Router from "next/router";
import dynamic from "next/dynamic";
import { isAuth, getCookie } from "../../actions/auth";
import { listCategories } from "../../actions/category";
import { listTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
import { QuillFormats, QuillModules } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { API } from "../../config";

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState("");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    title: "",
    body: "",
  });

  const { error, success, formData, title } = values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let ca = [];

    blogCategories.map((c, i) => {
      ca.push(c._id);
    });
    setCheckedCategory(ca);
  };

  const setTagsArray = (blogTags) => {
    let ta = [];

    blogTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

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

  const findOutCategory = (c) => {
    const result = checkedCategory.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTags = (t) => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((cat, index) => (
        <li className="list-unstyled" key={index}>
          <input
            onChange={handleToggleCat(cat._id)}
            checked={findOutCategory(cat._id)}
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
            checked={findOutTags(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const edithBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog title ${data.title} is successfully updated`,
        });
        if (isAuth() && isAuth().role === 1) {
          //refresh the page
          //   Router.replace(`/admin/crud/${router.query.slug}`);
          Router.replace(`/admin`);
        } else if (isAuth() && isAuth().role === 0) {
          //refresh the page
          //   Router.replace(`/user/crud/${router.query.slug}`);
          Router.replace(`/user`);
        }
      }
    });
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
      className="alert alert-danger"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form onSubmit={edithBlog}>
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
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}

          <div className="pt-3">
            <div>
              {showSuccess()}
              {showError()}
            </div>

            {body && (
              <img
                src={`${API}/blog/photo/${router.query.slug}`}
                alt={title}
                style={{ width: "100%" }}
              />
            )}
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

export default withRouter(BlogUpdate);
