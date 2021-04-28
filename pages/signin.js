import Layout from "../components/Layout";
import SigninComponent from "../components/auth/SigninComponent";
import { withRouter } from "next/router";

const Signin = ({ router }) => {
  const showRediredtMessage = () => {
    if (router.query.message) {
      return <div className="alert alert-danger">{router.query.message}</div>;
    } else {
      return;
    }
  };
  return (
    <Layout>
      <h2 style={{  textAlign: "center" }}>Signin</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">{showRediredtMessage()}</div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);
