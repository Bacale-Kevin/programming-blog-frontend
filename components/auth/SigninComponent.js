import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import LoginGoogle from "./LoginGoogle";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "bacale@gmail.com",
    password: "password",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { email, password, error, loading, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        //save user token to cookie
        //save user info to localstorage
        //authenticate user
        authenticate(data, () => {
          //? Router comes from nextJs and permits to redirect the user
          if (isAuth() && isAuth().role === 1) {
            Router.push("/admin");
          } else {
            Router.push("/user");
          }
        });
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

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
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
          <button className="btn btn-primary ">Signin</button>
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
      {showForm && signinForm()}
      <br />
      <Link href="/auth/password/forgot">
        <a className="btn btn-outline-danger btn-sm">Reset password</a>
      </Link>
    </>
  );
};

export default SigninComponent;
