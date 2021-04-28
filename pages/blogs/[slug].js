import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { singleBlog, listRelated } from "../../actions/blog";
import { API, APP_NAME, DOMAIN } from "../../config";
import moment from "moment";
import renderHtml from "react-render-html";

import React from "react";
import DisqusThread from "../../components/DisqusThread";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  const loadRelatedBlogs = () => {
    listRelated({ blog }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelatedBlogs();
  }, []);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      {/* use by social networks */}
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta
        property="og:image"
        content={`${API}/api/blog/photo/${blog.slug}`}
      />
      <meta
        property="og:image:secure_url"
        content={`${API}/api/blog/photo/${blog.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      {/* have to go to facebook developer to have the id */}
      {/* <meta property='fb:app_id' content={`${APP_NAME}`}/> */}
    </Head>
  );

  const showBlogsCategories = (blog) => {
    return blog.categories.map((cat, i) => (
      <Link key={i} href={`/categories/${cat.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{cat.name}</a>
      </Link>
    ));
  };

  const showBlogsTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/categories/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog.id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        />
      </div>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${API}/api/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <div className="display-2 pb-3 pt-3 text-center font-weight-bold">
                    {blog.title}
                  </div>
                  <p className="lead mt-3 mark">
                    Written by{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{" "}
                    | Published {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogsCategories(blog)}
                    {showBlogsTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>

            <div className="container">
              <section>
                <div className="col-md-12 lead" style={{ maxWidth: 230 }}>
                  {renderHtml(blog.body)}
                </div>
              </section>
            </div>
            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <hr />
              //* Facing an issue with the related blogs!!!!!!!! : - (
            </div>
            <div className="container pb-5 pt-5">{showComments()}</div>
          </article>
        </main>
      </Layout>
    </>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    if (!data) {
      console.log(" Blog Not found");
    } else {
      return { blog: data, query: query }; //return to the props component
    }
  });
};

export default SingleBlog;
