import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState } from "react";
import { singleTag } from "../../actions/tag";
import { API, APP_NAME, DOMAIN } from "../../config";
import Card from "../../components/blog/Card";

const Tag = ({ tag, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`Best programming tutorials on ${tag.name}`}
      />
      <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
      {/* use by social networks */}
      <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta
        property="og:description"
        content={`Best programming tutorials on ${tag.name}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/seo-blog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/seo-blog.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      {/* have to go to facebook developer to have the id */}
      {/* <meta property='fb:app_id' content={`${APP_NAME}`}/> */}
    </Head>
  );
  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                {blogs.map((b, i) => (
                  <>
                    <Card blog={b} key={i} />
                    <hr />
                  </>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

Tag.getInitialProps = ({ query }) => {
  return singleTag(query.slug)
    .then((data) => {
      console.log({ data });
      if (data.error) {
        console.log(data.error);
      } else {
        return { tag: data.tag, blogs: data.blogs, query };
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default Tag;
