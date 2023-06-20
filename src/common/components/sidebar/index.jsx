import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  let location = useLocation();

  const adminRoutes = [
    {
      name: "Dashboard",
      path: "/",
      icon: "nc-icon nc-bank",
    },
    {
      name: "Brands",
      path: "/brands",
      icon: "fa fa-file",
    },
    {
      name: "Models",
      path: "/models",
      icon: "fa fa-list",
    },
    {
      name: "Variants",
      path: "/variants",
      icon: "fa fa-list",
    },
    {
      name: "User Reviews",
      path: "/user_reviews",
      icon: "fa fa-list",
    },
    {
      name: "Admin Reviews",
      path: "/admin_reviews",
      icon: "fa fa-list",
    },
    {
      name: "upcoming car",
      path: "/upcoming_cars",
      icon: "fa fa-plus",
    },
    {
      name: "Add Products",
      path: "/add_product",
      icon: "fa fa-plus",
    },
    {
      name: "Banners",
      path: "/add_slider",
      icon: "fa fa-plus",
    },
    {
      name: "Price",
      path: "/prices",
      icon: "nc-icon nc-money-coins",
    },
    {
      name: "Comparisons",
      path: "/comparisons",
      icon: "fa fa-list",
    },
    {
      name: "Images",
      path: "/images",
      icon: "fa fa-images",
    },
    {
      name: "Features",
      path: "/features",
      icon: "fa fa-bolt",
    },
    {
      name: "Questions & Answers",
      path: "/qa_panel",
      icon: "fa fa-comment",
    },
    {
      name: "News",
      path: "/news",
      icon: "fa fa-newspaper",
    },
    {
      name: "Import Files",
      path: "/import_files",
      icon: "fa fa-file-import",
    },
    {
      name: "SEO",
      path: "/seo",
      icon: "fa fa-file-import",
    },
  ];

  return (
    <div className="sidebar" data-color="white" data-active-color="danger">
      <div className="logo">
        <Link to="/" className="simple-text logo-mini">
          <div className="logo-image-small">
            <img
              src="../assets/img/ick-logo.png"
              alt="India car kharido logo"
            />
          </div>
        </Link>
        <Link to="/" className="simple-text logo-normal">
          India Car Kharido
        </Link>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          {adminRoutes?.map((v, i) => {
            return (
              <li className={v.path === location.pathname && "active"} key={i}>
                <Link
                  to={v.path}
                  onClick={() => {
                    localStorage.setItem("currentPage", v.name);
                  }}
                >
                  <i className={v.icon}></i>
                  <p>{v.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
