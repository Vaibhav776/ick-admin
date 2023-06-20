import React from "react";

export default function Navbar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button type="button" className="navbar-toggler">
              <span className="navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a className="navbar-brand">{localStorage.getItem("currentPage")}</a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navigation"
        >
          <ul className="navbar-nav">
            {/* <li className="nav-item">
                            <a className="nav-link btn-magnify" href="javascript:;">
                                <i className="nc-icon nc-layout-11"></i>
                                <p>
                                    <span className="d-lg-none d-md-block">Stats</span>
                                </p>
                            </a>
                        </li> */}
            <li className="nav-item btn-rotate dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="http://example.com"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="nc-icon nc-settings-gear-65"></i>
                <p>
                  <span className="d-lg-none d-md-block">Some Actions</span>
                </p>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <span className="dropdown-item cursor-pointer" onClick={logout}>
                  Logout
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    props.history.push("/");
  }
}
