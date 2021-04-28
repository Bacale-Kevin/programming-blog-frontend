import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  createCategory, listCategories, removeCategory, singleCategory
} from "../../actions/category";
import { isAuth, getCookie } from "../../actions/auth";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    remove: false,
    reload: false,
    messageSuccess: "",
    errorSuccess: "",
    removeSuccess: "",
  });

  const {
    name,
    reload,
    error,
    messageSuccess,
    success,
    tags,
    remove,
    errorSuccess,
    removeSuccess,
  } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadTags();
  }, [reload, messageSuccess, errorSuccess, removeSuccess]);

  const loadTags = () => {
    listCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data, success: false });
        // console.log(data);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm(
      "Are you sure you want to delete this tag?"
    );
    if (answer) {
      deleteTag(slug);
    }
  };

  const deleteTag = (slug) => {
    // console.log('delete', slug)
    removeCategory(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removeSuccess: "Tag deleted!",
          remove: !remove,
          reload: !reload,
        });
        setTimeout(() => {
          setValues({
            ...values,
            error: false,
            success: false,
            name: "",
            removeSuccess: "",
            remove: !remove,
            reload: !reload,
          });
        }, 3000);
      }
    });
  };

  //mapping through tags array
  const showTags = () => {
    return tags.map((tag, index) => {
      console.log(tag.name);
      return (
        <button
          onDoubleClick={() => deleteConfirm(tag.slug)}
          title="Double click to delete"
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
          key={index}
        >
          {tag.name}
        </button>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("create tag", name);
    createCategory({ name }, token).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          errorSuccess: "Tag Already Exist",
        });
        setTimeout(() => {
          setValues({
            ...values,
            error: false,
            success: true,
            // messageSuccess: "",
            errorSuccess: "",
            name: "",
            remove: !remove,
            reload: !reload,
          });
        }, 3000);
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          messageSuccess: "Tag saved!",
        //   removeSuccess: "Tag deleted!",
          name: "",
          remove: !remove,
          reload: !reload,
        });
        setTimeout(() => {
          setValues({
            ...values,
            error: false,
            success: true,
            messageSuccess: "",
            name: "",
            remove: !remove,
            reload: !reload,
          });
        }, 3000);
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      remove: "",
    });
  };


  const newTagForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          value={name}
          type="text"
          className="form-control"
          required
        />
        <button className="btn btn-primary mt-3">Create</button>
      </div>
    </form>
  );

  return (
    <>
      <p className="text-success">{messageSuccess}</p>
      <p className="text-danger">{removeSuccess}</p>
      <p className="text-danger">{errorSuccess}</p>

      <div>
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
};

export default Category;
