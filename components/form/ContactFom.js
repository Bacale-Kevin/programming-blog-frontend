import { useState } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";

const ContactFom = ({authorEmail}) => {
  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "Send Message",
    success: false,
    error: false,
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Sending ..." });
    emailContactForm({ authorEmail, name, email, message }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          name: "",
          email: "",
          message: "",
          buttonText: "Message Submitted!",
          sent: true,
          success: data.success,
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: "Send Message",
    });
  };

  const ShowSuccessMessage = () =>
    success && (
      <div className="alert alert-info">Thanks you for contacting us!.</div>
    );

  const ShowErrorMessage = () =>
    error && <div className="alert alert-danger">{error}</div>;

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="lead">Message</label>
          <textarea
            onChange={handleChange("message")}
            type="text"
            className="form-control"
            value={message}
            required
            rows="10"
          ></textarea>
        </div>
        <div className="form-group">
          <label className="lead">Name</label>
          <input
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            value={name}
            required
          />
        </div>
        <div className="form-group">
          <label className="lead">Email</label>
          <input
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            value={email}
            required
          />
        </div>
        <div
          type="submit"
          onClick={clickSubmit}
          className="btn btn-primary mb-5"
        >
          {buttonText}
        </div>
      </form>
    );
  };

  return (
    <>
      {ShowErrorMessage()}
      {ShowSuccessMessage()}
      {contactForm()}
    </>
  );
};

export default ContactFom;
