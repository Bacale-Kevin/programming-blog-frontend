import Link from "next/link";
import Private from "../../components/auth/Private";
import Layout from "../../components/Layout";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">User Dashboard</div>
            <div className="col-md-4">
              <ul class="list-group">
                <li className="list-group-item">
                  <Link href="user/crud/blog">
                    <a>Create Blog</a>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="user/crud/blogs">
                    <a>Update/Delete Blogs</a>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="user/update">
                    <a>Update Profile</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-8">right</div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
