import React from "react";

const Footer = () => (
  <footer className="page-footer font-small blue pt-4">
    <div className="container-fluid text-center text-md-left">
      <hr />
      <div className="row">
        <div className="col-md-9 mt-md-0 mt-3">
          <h5 className="text-uppercase">Content</h5>
          <p>
            'No Fake Chain' harnesses the potential of blockchain technology to
            ensure that every image's origin can be traced and verified. When an
            image is added to the blockchain, it is timestamped and locked into
            a block. This block, once part of the blockchain, cannot be altered
            without changing every subsequent block, which would require the
            consensus of the majority in the network. This ensures that every
            image's history is transparent and unchangeable.
          </p>
        </div>

        <hr className="clearfix w-100 d-md-none pb-0" />
        <div className="col-md-3 mb-md-0 mb-3">
          <h5 className="text-uppercase">Team</h5>
          <ul className="list-unstyled">
            <li>
              <a href="https://www.linkedin.com/in/byungheon-lee/">Eric Lee</a>
            </li>
            <li>
              <a href="https://github.com/hyunkicho">Hyunki Cho</a>
            </li>
            <li>
              <a href="https://github.com/lukepark327">Luke Park</a>
            </li>
            <li>
              <a href="https://github.com/hahahihiho">HyunMyeong Cho</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-copyright text-center py-3">
      © 2023 Copyright:
      <a href="https://cplabs.io/"> CPLabs</a>
    </div>
  </footer>
);

export default Footer;
