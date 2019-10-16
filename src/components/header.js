import React from "react";
import Link from "gatsby-link";
import github_logo from "../images/github.svg";

const Header = ({ siteTitle }) => (
  <div>
    <div className="background-hero"></div>
    <div className="container">
      <div className="nav">
        <div className="brand-text">
          <a className="brand-text-link" href="https://www.gitstart.tech/">
            {siteTitle}
          </a>
        </div>
        <div className="github-logo">
          <a
            className="github-button"
            href="https://github.com/rishabh-bansal"
            data-size="large"
            aria-label="Follow @rishabh-bansal on GitHub"
          >
            Follow
          </a>
          <a target="_blank" href="https://github.com/rishabh-bansal/GitStart">
            <img alt="github-logo" src={github_logo} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
