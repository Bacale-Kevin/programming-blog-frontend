import { useState, useEffect } from "react";
import Router from "next/router";
import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../config";
import GoogleLogin from "react-google-login";

const LoginGoogle = () => {
  const responseGoogle = (response) => {
    // console.log(response);
    const tokenId = response.tokenId;
    const user = { tokenId };
    loginWithGoogle(user).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
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
  return (
    <div className="pb-4">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme="dark"
      />
    </div>
  );
};

export default LoginGoogle;
