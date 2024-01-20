import React, { useState } from "react";
import "./index.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReactPaginate from "react-paginate";

const AccountCusHeader = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <div>
      <div className="columns">
        <div className="column is-one-fifth">
          <h4
            className="title is-3"
            style={{ paddingLeft: "20px", paddingTop: "20px" }}
          >
            Tài khoản
          </h4>
        </div>
        <div
          className="column is-three-fifths"
          style={{ width: "550px", paddingTop: "30px", paddingLeft: "80px" }}
        >
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Tìm kiếm" />
              <span className="icon is-small is-left">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </p>
          </div>
        </div>
        <div
          className="column is-one-fifth"
          style={{
            marginLeft: "200px",
            paddingTop: "35px",
            display: "flex",
            alignContent: "center",
          }}
        >
          <div>
            <AccountCircleIcon fontSize="large" />
          </div>
          <h5 className="title is-4 pl-4 pt-1">{admin.role}</h5>
        </div>
      </div>
      <div className="pl-5">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a href="/admin">
                <h5 className="subtitle is-5">Tài khoản</h5>
              </a>
            </li>
            <li>
              <h5 className="subtitle is-5">
                <a href="/admin">Khách hàng</a>
              </h5>
            </li>
          </ul>
        </nav>
      </div>
      <div className="tags are-large mt-5 ml-5">
        <span
          className="tag"
          style={{ backgroundColor: "#172039", color: "#FFFFFF" }}
        >
          Tổng cộng (2)
        </span>
      </div>
    </div>
  );
};

const items = [
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
  {
    Id: 1,
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    UserName: "anhtu",
    FullName: "AnhTu",
    Phone: "0937550256",
    Email: "tudase151149@fpt.edu.vn",
  },
];

const AccountCusContent = ({ itemsPerPage }) => {
  console.log(itemsPerPage);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  return (
    <div className="table-container">
      <table className="table table is-narrow is-fullwidth is-hoverabley">
        <thead>
          <tr>
            <th>
              <h6 className="title is-5">STT</h6>
            </th>
            <th>
              <h6 className="title is-5">Ảnh đại diện</h6>
            </th>
            <th>
              <h6 className="title is-5">Tên người dùng</h6>
            </th>
            <th>
              <h6 className="title is-5">Họ và tên</h6>
            </th>
            <th>
              <h6 className="title is-5">Số điện thoại</h6>
            </th>
            <th>
              <h6 className="title is-5">Email</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr>
              <td>{item.Id}</td>
              <td>
                <figure className="image is-64x64">
                  <img src={item.Avatar} alt="#logo" />
                </figure>
              </td>
              <td>{item.UserName}</td>
              <td>{item.FullName}</td>
              <td>{item.Phone}</td>
              <td>{item.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <ReactPaginate
        breakLabel="..."
        nextLabel="Tiếp theo >>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<< Quay lại"
        className="admin-paginate"
        marginPagesDisplayed={10}
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="pagination"
        previousClassName="page-item-previous"
        nextClassName="page-item-next"
        breakClassName="page-item"
        containerClassName="pagination"
        activeClassName="active"
        activeLinkClassName="active"
        previousLinkClassName="pagination"
        nextLinkClassName="pagination"
      />
    </div>
  );
};

export const AccountCus = () => {
  return (
    <>
      <div className="admin-account-customer-main-container">
        <div className="admin-account-custommer-header">
          <AccountCusHeader />
        </div>
        <div className="admin-account-customer-content">
          <AccountCusContent itemsPerPage={5} />
        </div>
      </div>
    </>
  );
};
