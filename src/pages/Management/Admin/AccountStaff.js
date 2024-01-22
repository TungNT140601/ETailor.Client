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
import { useQuery } from "react-query";
import AvatarEditor from "react-avatar-edit";

const AccountStaffHeader = () => {
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
                <a href="/admin/account/staff">Nhân viên</a>
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
          <i className="fa-solid fa-plus"></i> &nbsp;&nbsp;Thêm mới nhân viên
        </button>
      </div>
      <BasicModal open={open} handleClose={handleClose} />
    </div>
  );
};

function BasicModal({ open, handleClose }) {
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [editor, setEditor] = useState(null);
  const [Fullname, setFullname] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const createStaffUrl = "https://localhost:7259/api/staff";
  const admin = JSON.parse(localStorage.getItem("admin"));

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
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSelectedImageName(file.name);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(createStaffUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = JSON.stringify(response);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="title is-2">Thêm mới nhân viên</h2>
          <br />

          <h4 className="subtitle is-4">Họ và tên</h4>
          <input
            className="input is-normal"
            type="text"
            placeholder="Nhập họ và tên"
            value={Fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <h4 className="subtitle is-4 mt-5">Tên người dùng</h4>
          <input
            className="input is-normal"
            type="text"
            placeholder="Nhập tên người dùng"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <h4 className="subtitle is-4 mt-5">Ảnh đại diện</h4>
          <div>
            <div class="file is-info has-name">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  onChange={handleFileChange}
                  name="resume"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">Upload your image…</span>
                </span>
              </label>
            </div>
            {selectedImage && (
              <div>
                {/* Display the selected image or perform other actions */}
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview-image"
                />
              </div>
            )}
          </div>

          <h4 className="subtitle is-4 mt-5">Nhập mật khẩu</h4>
          <p className="control has-icons-right">
            <input
              className="input is-normal"
              type="password"
              placeholder="Nhập mật khẩu"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={passwordConfirm}
              onInput={(e) => {
                const confirm = e.target.value;
                console.log("confirm:", confirm, "pass", Password);
                setPasswordConfirm(confirm);
                if (confirm !== Password) {
                  console.log("Mật Khẩu không đúng");
                } else {
                  console.log("Mật Khẩu đúng");
                }
              }}
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
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
          <h4 className="subtitle is-4 mt-5">Số điện thoại</h4>
          <input
            className="input is-normal"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
          ></input>
          {/* <h4 className="subtitle is-4 mt-5">Kỹ năng chuyên môn</h4>
          <MultiSelect
            options={choose}
            value={selectedSkill}
            onChange={setSelectedSkill}
            labelledBy="Chọn chuyên môn phù hợp"
          /> */}
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
            {passwordConfirm === null ||
            passwordConfirm === undefined ||
            passwordConfirm === "" ||
            passwordConfirm !== Password ? (
              <button
                className="button is-normal"
                type="submit"
                style={{ color: "#FFFFFF", backgroundColor: "#172039" }}
                disabled
              >
                Tạo mới
              </button>
            ) : (
              <button
                className="button is-normal"
                type="submit"
                style={{ color: "#FFFFFF", backgroundColor: "#172039" }}
                onClick={handleCreate}
              >
                Tạo mới
              </button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const AccountStaffContent = ({ itemsPerPage }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const getStaffUrl = "https://etailorapi.azurewebsites.net/api/staff";
  const { data: staffs, isLoading: loading } = useQuery("getStaffs", () =>
    fetch(getStaffUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin?.token}`,
      },
    }).then((response) => response.json())
  );
  console.log("all staffs", staffs);

  console.log(itemsPerPage);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = staffs?.data?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(staffs?.data?.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % staffs?.data?.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  const style = [
    {
      textAlign: "center",
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
              <h6 className="title is-6">Tùy chỉnh</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((item, index) => (
            <tr style={style[0]} key={item.id}>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h6
                    className="subtitle is-6"
                    style={{ height: 20, overflowY: "hidden" }}
                  >
                    {item.stt}
                  </h6>
                </div>
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p
                    className="subtitle is-6"
                    style={{
                      height: 60,
                      width: 100,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.username}
                  </p>{" "}
                </div>
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <img
                      src={item.avatar}
                      alt=""
                      style={{
                        height: "64px",
                        width: "64px",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    />
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p
                    className="subtitle is-6"
                    style={{
                      height: 60,
                      width: 100,
                      textAlign: "center",
                      overflowY: "hidden",
                      overflowX: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.fullname}
                  </p>
                </div>
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p
                    className="subtitle is-6"
                    style={{
                      height: 60,
                      width: 100,
                      overflowY: "hidden",
                      overflowX: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.address}
                  </p>
                </div>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
                    {item.phone}
                  </p>
                </div>
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

export const AccountStaff = () => {
  return (
    <>
      <div className="admin-account-staff-main-container">
        <div className="admin-account-staff-header">
          <AccountStaffHeader />
        </div>
        <div className="admin-account-staff-content">
          <AccountStaffContent itemsPerPage={5} />
        </div>
      </div>
    </>
  );
};
