import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import {
  Typography, Button, Flex, Divider, Carousel, Input, Table, Checkbox, Modal, Breadcrumb, theme, Form, Space, Select, Radio, Upload, Steps, Row, Col, Card, Avatar, message
} from "antd";
import { useQuery, useQueryClient, queryClient } from "react-query";
import Loading from "../LoadingComponent/loading";
import BangSize from "../../../assets/images/bangsize.jpg";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Swal from "sweetalert2";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { getTwoToneColor, setTwoToneColor } from "@ant-design/icons";
const formatDate = (date) => {
  const datetime = new Date(date);
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const year = datetime.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const UpdateBodyProfileModal = ({ open, onCreate, onCancel, initialValues }) => {
  const [formInstance, setFormInstance] = useState();
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Cập nhật số đo"
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={onCancel}
      destroyOnClose
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          formInstance?.resetFields();
          onCreate(values);
        } catch (error) {
          console.log('Failed:', error);
        }
      }}
    >
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const CustomerBodyProfile = ({ loadProfile }) => {
  const navigate = useNavigate();
  const customer = localStorage.getItem("customer");
  const token = JSON.parse(customer)?.token;
  const { data: getBodyProfile } = useQuery("get-all-bodyProfile", () =>
    fetch(`https://e-tailorapi.azurewebsites.net/api/profile-body`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json())
  );
  const [detailProfile, setDetaiProfile] = useState('')

  const handleEdit = async (id) => {
    console.log("ID:", id)
    if (id) {
      const GET_DETAIL_PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body/3379a8d0-254f-44ff-a3d8-59b462/${id}`;
      fetch(GET_DETAIL_PROFILE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDetaiProfile(data);
          console.log("DATA DETAIL:", data)
          setOpenUpdateModal(true);
        })
        .catch((error) => {
          console.error("Error fetching blog detail:", error);
        });
    }

  }
  const [formValues, setFormValues] = useState();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setOpen(false);
  };
  const handleDeleteProfile = async (id) => {
    Swal.fire({
      title: "Bạn muốn xoá số đo này ?",
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isDenied) {
        const DELETE_PROFILE_URL = `https://e-tailorapi.azurewebsites.net/api/profile-body/${id}`;
        const customer = localStorage.getItem("customer");
        const token = JSON.parse(customer)?.token;
        try {
          const response = await fetch(DELETE_PROFILE_URL, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            await Swal.fire({
              icon: "success",
              title: "Xoá thành công",
              timer: 2000,
            });
            loadProfile();
          } else {
            const errorText = await response.text();
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
        }
      }
    });
  };
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleUpdateProfile = async (id) => {
    const UPDATE_PROFILE_URL = `https://e-tailorapi.azurewebsites.net/api/profile-body/${id}`;
    const customer = localStorage.getItem("customer");
    const token = JSON.parse(customer)?.token;
    try {
      const response = await fetch(UPDATE_PROFILE_URL, {
        method: "GET",
        headers: {
          "Content-Type": " application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("GET DETAIL:", data);
      }
    } catch { }
  };
  return (
    <>

      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ color: "#9F78FF" }}>STT</th>
            <th style={{ color: "#9F78FF" }}>Tên số đo</th>
            <th style={{ color: "#9F78FF" }}>Người đo</th>
            <th style={{ color: "#9F78FF" }}>Ngày đo</th>
            <th style={{ color: "#9F78FF" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {getBodyProfile &&
            getBodyProfile.map((profile, index) => (
              <>
                <tr key={profile.id}>
                  <td>{index + 1}</td>
                  <td>{profile.name}</td>
                  <td>
                    {profile?.staffName
                      ? profile.staffName
                      : profile.customerName}
                  </td>
                  <td>{formatDate(profile?.createdTime)}</td>
                  <td style={{ display: "flex" }}>
                    <div
                      onClick={() => {
                        handleDeleteProfile(profile.id);
                      }}
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        cursor: "pointer",
                        overflow: "hidden",
                        textAlign: "center",
                      }}
                    >
                      <DeleteTwoTone twoToneColor="#eb2f96" title="Xoá" />
                    </div>
                    <div
                      onClick={() => handleEdit(profile.id)}
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        cursor: "pointer",
                        overflow: "hidden",
                        textAlign: "center",
                      }}
                    >
                      <EditTwoTone title="Chỉnh sửa" />
                    </div>
                  </td>
                </tr>
              </>
            ))}
        </tbody>
      </table>
      <UpdateBodyProfileModal
        open={openUpdateModal}
        onCreate={onCreate}
        onCancel={() => setOpenUpdateModal(false)}
        initialValues={{
          modifier: 'public',
        }}
      />
    </>
  );
};

export default CustomerBodyProfile;
