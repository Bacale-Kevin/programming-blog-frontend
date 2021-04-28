import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState } from "react";
import { listAllBlogsCategoriesTags } from "../../actions/blog";
import { API, APP_NAME, DOMAIN } from "../../config";
import Card from "../../components/blog/Card";

const Blogs = ({ blogs, tags, categories, size, router }) => {
  const head = () => (
    <Head>
      <title>Programming blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Programming blogs and tutorials on react node next php laravel and web development"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      {/* use by social networks */}
      <meta
        property="og:title"
        content={`Latest web development tutorials | ${APP_NAME}`}
      />
      <meta
        property="og:description"
        content="Programming blogs and tutorials on react node next php laravel and web development"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
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

  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={i}>
        {/* passing the blog to the card component as props */}
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };

  const showAllCategories = () => {
    return categories.map((cat, i) => (
      <Link href={`/categories/${cat.slug}`} key={i}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{cat.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  return (
    <>
      <Layout>
        {head()}
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className=" font-weight-bold text-center">
                  Programming blogs and tutorials
                </h1>
              </div>
              <section>
                <p>
                  <div className="pb-5 text-center">
                    {showAllCategories()}
                    <br />
                    {showAllTags()}
                  </div>
                </p>
              </section>
            </header>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 ">{showAllBlogs()}</div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

//getInitial props renders the data from the server to the client on page initial load it can only be used on pages
Blogs.getInitialProps = () => {
  return listAllBlogsCategoriesTags().then((data) => {
    if (data.error) {
      console.log("Error --->", data.error);
    } else {
      //always return when using getInitialProps
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        size: data.size,
      };
    }
  });
};

export default withRouter(Blogs);
