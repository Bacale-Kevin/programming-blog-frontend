import { useState, useEffect } from "react";
import { forgotPassword, resetPassword } from "../../../../actions/auth";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";

import React from "react";

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    newPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const {  newPassword, error, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.id,
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
        setValues({
          ...values,
          error: data.error,
          showForm: false,
          newPassword: "",
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          error: false,
          newPassword: "",
        });
      }
    });
  };

  const showError = () =>
    error && <div className="alert alert-danger">{error}</div>;

  const showMessage = () =>
    message && <div className="alert alert-success">{message}</div>;

  return (
    <>
      <Layout>
        <div className="container-fluid">
          <h2>Reset password</h2>
          <hr />
          {showError()}
          {showMessage()}
          {showForm && (
            <div className="container">
              <form onSubmit={handleSubmit}>
                <div className="form-group pt-5">
                  <input
                    type="password"
                    onChange={(e) =>
                      setValues({ ...values, newPassword: e.target.value })
                    }
                    className="form-control"
                    value={newPassword}
                    placeholder="Type your password"
                    required
                  />
                </div>
                <div>
                  <button className="btn btn-primary">Change password</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default withRouter(ResetPassword);
