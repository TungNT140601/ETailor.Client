import React, { useState, useEffect } from "react";
import "./index.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReactPaginate from "react-paginate";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Button } from "@mui/material";
import { MultiSelect } from "react-multi-select-component";

const AccountManagerHeader = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
          <h5 className="title is-4 pl-4 pt-1">Admin</h5>
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
                <a href="/admin/account/manager">Quản lý</a>
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
        <button
          className="button is-link is-outlined mb-2 ml-4"
          onClick={handleOpen}
        >
          <i className="fa-solid fa-plus"></i> &nbsp;&nbsp;Thêm mới quản lý
        </button>
      </div>
      <BasicModal open={open} handleClose={handleClose} />
    </div>
  );
};

function BasicModal({ open, handleClose }) {
  const [selectedSkill, setSelectedSkill] = useState([]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: "90%",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
  };

  const options = [
    { id: 1, name: "Cắt vải" },
    { id: 2, name: "Ráp đồ" },
    { id: 3, name: "May áo" },
  ];
  const choose = options.map((test) => ({
    label: test.name,
    value: test.id,
  }));
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="title is-2">Thêm mới quản lý</h2>
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 className="subtitle is-4">Họ và tên</h4>
              <input
                style={{ width: "350px" }}
                className="input is-normal"
                type="text"
                placeholder="Nhập họ và tên"
              />
              <h4 className="subtitle is-4 mt-5">Tên đăng nhập</h4>
              <input
                style={{ width: "350px" }}
                className="input is-normal"
                type="text"
                placeholder="Nhập tên người dùng"
              ></input>
            </div>
            <div>
              <Button
                sx={{
                  // backgroundImage: `url(${selectedImage || 'your-default-image-url.jpg'
                  //     })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "160px",
                  height: "160px",
                  marginTop: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px dashed rgb(243, 156, 18)",
                }}
              >
                <input
                  // ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  // onChange={handleImageChange}
                />
                <AddPhotoAlternateIcon
                  fontSize="large"
                  // sx={{ ...buttonStyle }}
                />
              </Button>
            </div>
          </div>
          <h4 className="subtitle is-4 mt-5">Nhập mật khẩu</h4>
          <p className="control has-icons-right">
            <input
              className="input is-normal"
              type="password"
              placeholder="Nhập mật khẩu"
            ></input>
            <span className="icon is-small is-right">
              <i className="fa-solid fa-eye"></i>
            </span>
          </p>

          <h4 className="subtitle is-4 mt-5">Xác nhận mật khẩu</h4>
          <p className="control has-icons-right">
            <input
              className="input is-normal"
              type="password"
              placeholder="Xác nhận mật khẩu"
            ></input>
            <span className="icon is-small is-right">
              <i className="fa-solid fa-eye"></i>
            </span>
          </p>
          <h4 className="subtitle is-4 mt-5">Địa chỉ</h4>
          <input
            className="input is-normal"
            type="text"
            placeholder="Nhập địa chỉ"
          ></input>
          <h4 className="subtitle is-4 mt-5">Số điện thoại</h4>
          <input
            className="input is-normal"
            type="tel"
            placeholder="Nhập số điện thoại"
          ></input>
          <h4 className="subtitle is-4 mt-5">Kỹ năng chuyên môn</h4>
          <MultiSelect
            options={choose}
            value={selectedSkill}
            onChange={setSelectedSkill}
            labelledBy="Chọn chuyên môn phù hợp"
          />
          <div
            className="mt-5"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className="button is-normal"
              type="reset"
              style={{ color: "#FFFFFF", backgroundColor: "#172039" }}
            >
              Từ chối
            </button>
            &nbsp; &nbsp;
            <button
              className="button is-normal"
              type="submit"
              style={{ color: "#FFFFFF", backgroundColor: "#172039" }}
            >
              Tạo mới
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const items = [
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
  {
    Id: 1,
    UserName: "anhtu",
    Avatar: "https://bulma.io/images/placeholders/256x256.png",
    FullName: "Dao Anh Tu",
    Address: "117/18 Phan Văn Hân, Phường 17, Quận Bình Thạnh",
    Phone: "0937550256",
    Skills: "Cắt đồ",
  },
];

const AccountManagerContent = ({ itemsPerPage }) => {
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
  const style = [
    {
      textAlign: "center",
      height: "20px !important",
    },
    {
      centerTableHead: {
        textAlign: "center",
        width: "200px",
      },
    },
  ];

  return (
    <div className="table-container">
      <table className="table is-narrow is-fullwidth is-hoverable ">
        <thead>
          <tr>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">STT</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Tên đăng nhập</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Ảnh đại diện</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Họ và tên</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Địa chỉ</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Số điện thoại</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Chuyên môn</h6>
            </th>
            <th style={style[1].centerTableHead}>
              <h6 className="title is-6">Tùy chỉnh</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr style={style[0]}>
              <td>
                <h6
                  className="subtitle is-6"
                  style={{ height: 20, overflowY: "hidden" }}
                >
                  {item.Id}
                </h6>
              </td>
              <td>
                <p
                  className="subtitle is-6"
                  style={{
                    height: 60,
                    width: 140,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.UserName}
                </p>
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <figure className="image is-64x64">
                      <img src={item.Avatar} />
                    </figure>
                  </div>
                </div>
              </td>
              <td>
                <p
                  className="subtitle is-6"
                  style={{
                    height: 60,
                    width: 140,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.FullName}
                </p>
              </td>
              <td>
                <p
                  className="subtitle is-6"
                  style={{
                    height: 60,
                    width: 140,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.Address}
                </p>
              </td>
              <td>
                <p
                  className="subtitle is-6"
                  style={{
                    height: 60,
                    width: 140,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.Phone}
                </p>
              </td>
              <td>
                <p
                  className="subtitle is-6"
                  style={{
                    height: 60,
                    width: 140,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.Skills}
                </p>
              </td>
              <td>
                <div>
                  <i
                    class="fa-solid fa-trash"
                    style={{
                      padding: "5px",
                      fontSize: "20px",
                      backgroundColor: "#FF0000",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                  &nbsp; &nbsp;
                  <i
                    class="fa-solid fa-pen-to-square"
                    style={{
                      padding: "5px",
                      fontSize: "20px",
                      backgroundColor: "#1E90FF",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                </div>
              </td>
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

const AccountManager = () => {
  return (
    <>
      <div className="admin-account-manager-main-container">
        <div className="admin-account-manager-header">
          <AccountManagerHeader />
        </div>
        <div className="admin-account-manager-content">
          <AccountManagerContent itemsPerPage={5} />
        </div>
      </div>
    </>
  );
};

export default AccountManager;
