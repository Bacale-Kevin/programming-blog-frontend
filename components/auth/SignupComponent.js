import Router from "next/router";
import { useState, useEffect } from "react";
import { signup, isAuth, preSignup  } from "../../actions/auth";
import LoginGoogle from "./LoginGoogle";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "Bacale",
    email: "bacale@gmail.com",
    password: "password",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };

    preSignup(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data.message,
          showForm: false,
        });
        //added
        Router.push('/signin');
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading ...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            onChange={handleChange("name")}
            value={name}
            type="text"
            className="form-control"
            placeholder="Type your name"
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange("email")}
            value={email}
            type="email"
            className="form-control"
            placeholder="Type your email"
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange("password")}
            value={password}
            type="password"
            className="form-control"
            placeholder="Type your password"
          />
        </div>

        <div>
          <button className="btn btn-primary">Signup</button>
        </div>
      </form>
    );
  };
  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      <LoginGoogle />
      {showForm && signupForm()}
    </>
  );
};

export default SignupComponent;
