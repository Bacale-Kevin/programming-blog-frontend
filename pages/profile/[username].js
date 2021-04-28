import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { userPublicProfile } from "../../actions/user";
import { API, APP_NAME, DOMAIN } from "../../config";
import moment from "moment";
import renderHtml from "react-render-html";
import blog from "../../../backend/models/blog";
import ContactForm from "../../components/form/ContactFom";

const UserProfile = ({ user, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {user.username} | {APP_NAME}
      </title>
      <meta name="description" content={`Blogs by ${user.username}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
      {/* use by social networks */}
      <meta property="og:title" content={`${user.username} | ${APP_NAME}`} />
      <meta property="og:description" content={`Blogs by ${user.username}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/profile/${query.username}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/seo-blog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`/static/images/seo-blog.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      {/* have to go to facebook developer to have the id */}
      {/* <meta property='fb:app_id' content={`${APP_NAME}`}/> */}
    </Head>
  );
  const showUserBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="mt-4 mb-4">
          <Link href={`/blogs/${blog.slug}`}>
            <a className="lead">{blog.title}</a>
          </Link>
        </div>
      );
    });
  };
  return (
    <>
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>{user.name}</h5>
                      <p className="text-muted">
                        Joined {moment(user.createdAt).fromNow()}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <img
                        src={`http://localhost:5000/api/user/photo/${user.username}`}
                        className="img img-fluid mb-3 image-thumbnail"
                        style={{ maxHeight: "100px", maxWidth: "100%" }}
                        alt="user profile"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-5 pl-4 pr-4 text-light">{`Recent blogs by ${user.name}`}</h5>
                  {blogs.length > 0 ? (
                    showUserBlogs()
                  ) : (
                    <h4>No blogs created </h4>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-5 pl-4 pr-4 text-light">{`Message ${user.name}`}</h5>
                  <br />
                  <ContactForm authorEmail={user.email} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return userPublicProfile(query.username).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //   console.log({ data });
      return { user: data.user, blogs: data.blogs, query };
    }
  });
};

export default UserProfile;
