import { useState } from "react";
import { forgotPassword } from "../../../actions/auth";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });

  const { email, message, error, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, message: "", error: "", [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });
    forgotPassword({ email }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: "",
          showForm: false,
        });
      }
    });
  };

  const showError = () =>
    error && <div className="alert alert-danger">{error}</div>;

  const showMessage = () =>
    message && <div className="alert alert-success">{message}</div>;

  //   const passwordForgotForm = () => {
  //     <div className="container">
  //       <form onSubmit={handleSubmit}>
  //         <div className="form-group pt-5">
  //           <input
  //             type="email"
  //             onChange={handleChange("email")}
  //             className="form-control"
  //             value={email}
  //             placeholder="Enter your email address"
  //             required
  //           />
  //         </div>
  //         <div>
  //           <button className="btn btn-primary">Send password reset link</button>
  //         </div>
  //       </form>
  //     </div>;
  //   };

  return (
    <Layout>
      <div className="container">
        <h2>Forgot password</h2>
        <hr />
        {showError()}
        {showMessage()}

        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group pt-5">
              <input
                type="email"
                onChange={handleChange("email")}
                className="form-control"
                value={email}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div>
              <button className="btn btn-primary">
                Send password reset link
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
