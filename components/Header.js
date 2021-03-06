import { useState } from "react";
import { APP_NAME } from "../config";
import Link from "next/link";
import Router from "next/router";
import { isAuth, signout } from "../actions/auth";
import NProgress from "nprogress";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

import "../node_modules/nprogress/nprogress.css";
import Search from "./blog/Search";

//? When the router 'start' changing to navigate to another one
Router.onRouteChangeStart = (url) => NProgress.start();

Router.onRouteChangeComplete = (url) => NProgress.done();

Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <>
              <NavItem>
                <Link href="/blogs">
                  <NavLink style={{ cursor: "pointer" }}>Blogs </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/contact">
                  <NavLink style={{ cursor: "pointer" }}>Contact  </NavLink>
                </Link>
              </NavItem>
            </>
            {!isAuth() && (
              <>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Signup</NavLink>
                  </Link>
                </NavItem>
              </>
            )}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink style={{ cursor: "pointer" }}>{`${
                    isAuth().name
                  }'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 0 && (
              <>
                <NavItem>
                  <Link href="/user">
                    <NavLink style={{ cursor: "pointer" }}>{`${
                      isAuth().name
                    }'s Dashboard`}</NavLink>
                  </Link>
                </NavItem>
              </>
            )}
            {isAuth() && isAuth() && (
              <>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.push("/signin"))}
                  >
                    Signout
                  </NavLink>
                </NavItem>
              </>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user/crud/blog">
                  <NavLink className="btn btn-primary text-light">
                    Write a blog
                  </NavLink>
                </Link>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </div>
  );
};

export default Header;
