import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import {
  Typography, Button, Flex, Divider, Carousel, Input, Table, Checkbox, Modal, Form, Radio, Spin
} from "antd";
import { useQuery, useQueryClient, queryClient } from "react-query";
import Loading from "../LoadingComponent/loading";
import BangSize from "../../../assets/images/bangsize.jpg";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Swal from "sweetalert2";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { getTwoToneColor, setTwoToneColor } from "@ant-design/icons";
// import CustomerBodyProfile from "./CustomerBodyProfile";

const formatDate = (date) => {
  const datetime = new Date(date);
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const year = datetime.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const UpdateBodyProfileModal = ({ open, onCancel, bodySizeData, detailData, updateLoading, id }) => {
  const [inputValues, setInputValues] = useState([]);
  const [guideImg, setGuideImg] = useState(BangSize);
  const handleImageGuide = (id) => {
    const attribute = bodySizeData.filter((item) => item.id === id);
    setGuideImg(attribute[0]?.image);
  };
  const handleInputChange = (attributeId, value) => {
    console.log("Input Values:", inputValues);
    // const existingIndex = inputValues.findIndex(
    //   (item) => item.id === attributeId
    // );

    // if (existingIndex !== -1) {
    //   setInputValues((prevState) => {
    //     const newState = [...prevState];
    //     newState[existingIndex].value = value;
    //     validateInput(attributeId, value);
    //     return newState;
    //   });
    // } else {
    //   setInputValues((prevState) => [
    //     ...prevState,
    //     { id: attributeId, value: value },
    //   ]);
    //   validateInput(attributeId, value);
    // }
  };
  const [formInstance, setFormInstance] = useState();
  const [form] = Form.useForm();
  const [validationMessages, setValidationMessages] = useState({});
  const validateInput = (id, value) => {
    const attribute = bodySizeData.find((item) => item.id === id);
    if (!attribute) return;

    const min = parseFloat(attribute.minValidValue);
    const max = parseFloat(attribute.maxValidValue);
    const parsedValue = parseFloat(value);
    const isValid =
      !isNaN(parsedValue) &&
      parsedValue >= min &&
      parsedValue <= max &&
      value.trim() !== "";

    setValidationMessages((prevState) => ({
      ...prevState,
      [id]: isValid ? "" : `Số đo từ ${min} ~ ${max} cm`,
    }));
  };
  useEffect(() => {
    if (detailData) {
      const values = {};
      bodySizeData.forEach(attribute => {
        values[attribute.id] = detailData?.valueBodyAttribute.find(item => item.id === attribute.id)?.value || '';
      });
      setInputValues(values);
    }
  }, [detailData, bodySizeData]);
  const [updateBodyProfileName, setUpdateBodyProfileName] = useState(detailData.name ? detailData.name : "");
  const handleUpdateBodyProfileName = async (name) => {
    console.log("Update name:", name)
    setUpdateBodyProfileName(name)
  }
  console.log("DATA TRUYEFNAF VÀO:", detailData)
  const [profileID, setProfileID] = useState(id)
  const handleUpdateProfile = async (id) => {
    const UPDATE_PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body/${id}`;
    const customer = localStorage.getItem("customer");
    const token = JSON.parse(customer)?.token;
    try {
      const response = await fetch(UPDATE_PROFILE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": " application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updateBodyProfileName,
          valueBodyAttribute: inputValues,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      }
    } catch { }
  };
  return (
    <Modal
      open={open}
      title="Cập nhật số đo"
      okText="Thay đổi"
      cancelText="Huỷ"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={onCancel}
      style={{
        top: "150px",
        color: "#9F78FF",
        maxHeight: 550,
        overflow: "hidden",
        minHeight: 500
      }}
      width={900}
      onOk={() => handleUpdateProfile(profileID)}
    >


      {!updateLoading ? (
        <div className="example">
          <Spin />
        </div>
      ) : (
        <div>
          <hr style={{ margin: 10 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              paddingLeft: 20,
            }}
          >
            <div>
              <div style={{ paddingBottom: 20 }}>
                <label
                  className="title is-4 is-underlined"
                  style={{ display: "block", margin: 0, paddingBottom: 15 }}
                >
                  <span style={{ color: "red" }}>*</span>Tên số đo
                </label>
                <input
                  className="input is-normal"
                  value={detailData?.name}
                  onChange={(e) => handleUpdateBodyProfileName(e.target.value)}
                  name="name"
                  type="text"
                  autoComplete="off"
                  placeholder="Vd: Số đo áo sơ mi"
                />
              </div>
              <p
                className="title is-4 is-underlined"
                style={{ margin: 0, paddingBottom: 5 }}
              >
                Các chỉ số
              </p>
              <div
                style={{
                  height: 300,
                  overflowY: "scroll",
                }}
              >
                {Array.from({ length: 3 }, (_, i) => i + 1).map((index) => (
                  <div key={index}>
                    <p
                      className="title is-3"
                      style={{ margin: 0, padding: "10px 0 10px 10px" }}
                    >
                      {index === 1
                        ? "I. Phần đầu"
                        : index === 2
                          ? "II. Phần thân trên"
                          : "III. Phần thân dưới"}
                    </p>
                    {bodySizeData &&
                      bodySizeData.map((attribute, attrIndex) => {
                        if (attribute?.bodyIndex === index) {
                          return (
                            <div
                              key={attrIndex}
                              className="field"
                              style={{ paddingLeft: "20px" }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 5,
                                  display: "flex",
                                  paddingBottom: 5,
                                }}
                              >
                                <label
                                  className="title is-3 "
                                  style={{
                                    display: "block",
                                    margin: 0,
                                    width: 150,
                                  }}
                                >
                                  {attribute.name}
                                </label>
                                {validationMessages[attribute.id] && (
                                  <p style={{ color: "red", marginLeft: 10 }}>
                                    {validationMessages[attribute.id]}
                                  </p>
                                )}
                              </div>

                              <input
                                className="input is-normal"
                                autoComplete="off"
                                onClick={() => {
                                  handleImageGuide(attribute.id);
                                }}
                                name={`${attribute.id}`}
                                type="text"
                                placeholder={`${attribute.minValidValue}~${attribute.maxValidValue} cm`}
                                style={{
                                  height: 35,
                                  textAlign: "center",
                                  borderRadius: 5,
                                  width: 300,
                                }}
                                onChange={(e) =>
                                  handleInputChange(
                                    attribute.id,
                                    e.target.value
                                  )
                                }
                                value={inputValues[attribute.id]}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p className="title is-4">Hướng dẫn cách lấy số đo</p>
              <div
                style={{
                  paddingLeft: 20,
                  placeItems: "center",
                  height: "100%",
                  overflowY: "hidden",
                  maxHeight: "360px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={guideImg}
                  style={{
                    objectFit: "cover",
                    width: "400px",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px #88888858",
                  }}
                  alt="Guide"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </Modal>
  );
};
const CustomerBodyProfile = ({ loadProfile, allBodySize, getBodyProfile, getAllProfileLoading }) => {
  const navigate = useNavigate();
  const customer = localStorage.getItem("customer");
  const token = JSON.parse(customer)?.token;
  // const { data: getBodyProfile, isLoading: getAllProfileLoading } = useQuery("get-all-bodyProfile", () =>
  //   fetch(`https://etailorapi.azurewebsites.net/api/profile-body`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((response) => response.json())
  // );
  const [detailProfile, setDetaiProfile] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateProfileId, setUpdateProfileId] = useState('')
  const handleEdit = async (id) => {
    setOpenUpdateModal(true);
    if (id) {
      const GET_DETAIL_PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body/${id}`;
      fetch(GET_DETAIL_PROFILE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDetaiProfile(data);
          setUpdateLoading(true)
          setUpdateProfileId(id)
        })
        .catch((error) => {
          console.error("Error fetching blog detail:", error);
          setUpdateLoading(false)
        });
    }

  }
  const [formValues, setFormValues] = useState();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const onCreate = (values) => {
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
        const DELETE_PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body/${id}`;
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
            loadProfile();
            await Swal.fire({
              icon: "success",
              title: "Xoá thành công",
              timer: 2000,
            });

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
          {!getAllProfileLoading ? (
            getBodyProfile &&
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

            ))
          ) : (
            <div>Loading....</div>
          )
          }

        </tbody>
      </table>
      <UpdateBodyProfileModal
        open={openUpdateModal}
        onCreate={onCreate}
        onCancel={() => setOpenUpdateModal(false)}
        updateLoading={updateLoading}
        detailData={detailProfile}
        initialValues={{
          modifier: 'public',
        }}
        id={updateProfileId}
        bodySizeData={allBodySize}
      />
    </>
  );
};
export default function BodyProfile() {
  const navigate = useNavigate();
  const [validationMessages, setValidationMessages] = useState({});
  const [inputValues, setInputValues] = useState([]);
  const [bodyProfileName, setBodyProfileName] = useState("");
  const handleInputBodyProfileName = (value) => {
    setBodyProfileName(value);
  };
  const validateInput = (id, value) => {
    const attribute = getAllBodyAttributes.find((item) => item.id === id);
    if (!attribute) return;

    const min = parseFloat(attribute.minValidValue);
    const max = parseFloat(attribute.maxValidValue);
    const parsedValue = parseFloat(value);
    const isValid =
      !isNaN(parsedValue) &&
      parsedValue >= min &&
      parsedValue <= max &&
      value.trim() !== "";

    setValidationMessages((prevState) => ({
      ...prevState,
      [id]: isValid ? "" : `Số đo từ ${min} ~ ${max} cm`,
    }));
  };
  const handleInputChange = (attributeId, value) => {
    const existingIndex = inputValues.findIndex(
      (item) => item.id === attributeId
    );

    if (existingIndex !== -1) {
      setInputValues((prevState) => {
        const newState = [...prevState];
        newState[existingIndex].value = value;
        validateInput(attributeId, value);
        return newState;
      });
    } else {
      setInputValues((prevState) => [
        ...prevState,
        { id: attributeId, value: value },
      ]);
      validateInput(attributeId, value);
    }
  };
  const [form] = Form.useForm();
  const [guideImg, setGuideImg] = useState(BangSize);
  const handleFocusOut = () => {
    setGuideImg(BangSize);
  };

  const handleImageGuide = (id) => {
    const attribute = getAllBodyAttributes.filter((item) => item.id === id);
    setGuideImg(attribute[0]?.image);
  };
  const handleCreateBodySize = async () => {
    const PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body`;
    const customer = localStorage.getItem("customer");
    const token = JSON.parse(customer)?.token;
    try {
      const response = await fetch(PROFILE_URL, {
        method: "POST",
        headers: {
          "Content-Type": " application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: bodyProfileName,
          valueBodyAttribute: inputValues,
        }),
      });

      if (response.ok) {
        handleCancel();
        await Swal.fire({
          icon: "success",
          title: "Tạo mới thành công",
          timer: 2000,
        });
        fetchProfileData()
        setBodyProfileName('')
        inputValues([])

      } else {
        const errorText = await response.text();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  const customer = localStorage.getItem("customer");
  const token = JSON.parse(customer)?.token;

  const [hasFetchedData, setHasFetchedData] = useState(false);
  useEffect(() => {
    if (!hasFetchedData) {
      fetchProfileData();
    }
  }, [hasFetchedData]);

  const [getLoading, setGetLoading] = useState(true)
  const [getBodyProfile, setGetBodyProfile] = useState('')
  const fetchProfileData = async () => {
    const customer = localStorage.getItem("customer");
    const token = JSON.parse(customer)?.token;
    try {
      const response = await fetch(`https://etailorapi.azurewebsites.net/api/profile-body`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHasFetchedData(true);
        const data = await response.json();
        setGetBodyProfile(data);
        setGetLoading(false)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data: getAllBodyAttributes, isLoading } = useQuery(
    "get-all-bodyAtrributes",
    () =>
      fetch(`https://etailorapi.azurewebsites.net/api/body-size`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => response.json())
  );


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p className=" title is-2">Hồ sơ số đo</p>
      </div>
      <Button type="primary" onClick={showModal}>
        Thêm mới
      </Button>
      <Modal
        open={isModalOpen}
        onOk={handleCreateBodySize}
        cancelText="Huỷ"
        okText="Thêm mới"
        title="Thêm mới số đo"
        onCancel={handleCancel}
        style={{
          top: "150px",
          color: "#9F78FF",
          maxHeight: 550,
          overflow: "hidden",
        }}
        width={900}
      >
        {/* {isLoading ? (
          <Loading />
        ) : ( */}

        <div>
          <hr style={{ margin: 10 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              paddingLeft: 20,
            }}
          >
            <div>
              <div style={{ paddingBottom: 20 }}>
                <label
                  className="title is-4 is-underlined"
                  style={{ display: "block", margin: 0, paddingBottom: 15 }}
                >
                  <span style={{ color: "red" }}>*</span>Tên số đo
                </label>
                <input
                  className="input is-normal"
                  value={bodyProfileName}
                  onChange={(e) => handleInputBodyProfileName(e.target.value)}
                  name="name"
                  type="text"
                  autoComplete="off"
                  placeholder="Vd: Số đo áo sơ mi"
                />
              </div>
              <p
                className="title is-4 is-underlined"
                style={{ margin: 0, paddingBottom: 5 }}
              >
                Các chỉ số
              </p>
              <div
                style={{
                  height: 300,
                  overflowY: "scroll",
                }}
              >
                {Array.from({ length: 3 }, (_, i) => i + 1).map((index) => (
                  <div key={index}>
                    <p
                      className="title is-3"
                      style={{ margin: 0, padding: "10px 0 10px 10px" }}
                    >
                      {index === 1
                        ? "I. Phần đầu"
                        : index === 2
                          ? "II. Phần thân trên"
                          : "III. Phần thân dưới"}
                    </p>
                    {getAllBodyAttributes &&
                      getAllBodyAttributes.map((attribute, attrIndex) => {
                        if (attribute?.bodyIndex === index) {
                          return (
                            <div
                              key={attrIndex}
                              className="field"
                              style={{ paddingLeft: "20px" }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 5,
                                  display: "flex",
                                  paddingBottom: 5,
                                }}
                              >
                                <label
                                  className="title is-3 "
                                  style={{
                                    display: "block",
                                    margin: 0,
                                    width: 150,
                                  }}
                                >
                                  {attribute.name}
                                </label>
                                {validationMessages[attribute.id] && (
                                  <p style={{ color: "red", marginLeft: 10 }}>
                                    {validationMessages[attribute.id]}
                                  </p>
                                )}
                              </div>

                              <input
                                className="input is-normal"
                                autoComplete="off"
                                onClick={() => {
                                  handleImageGuide(attribute.id);
                                }}
                                name={`${attribute.id}`}
                                type="text"
                                placeholder={`${attribute.minValidValue}~${attribute.maxValidValue} cm`}
                                style={{
                                  height: 35,
                                  textAlign: "center",
                                  borderRadius: 5,
                                  width: 300,
                                }}
                                onChange={(e) =>
                                  handleInputChange(
                                    attribute.id,
                                    e.target.value
                                  )
                                }
                                value={inputValues[attribute.id]}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p className="title is-4">Hướng dẫn cách lấy số đo</p>
              <div
                style={{
                  paddingLeft: 20,
                  placeItems: "center",
                  height: "100%",
                  overflowY: "hidden",
                  maxHeight: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={guideImg}
                  style={{
                    objectFit: "cover",
                    width: "400px",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px #88888858",
                  }}
                  alt="Guide"
                />
              </div>

            </div>
          </div>
        </div>
        {/* )
        } */}
      </Modal>
      <div style={{ width: "100%", paddingTop: "20px" }}>
        <CustomerBodyProfile loadProfile={fetchProfileData} getBodyProfile={getBodyProfile} getAllProfileLoading={getLoading} allBodySize={getAllBodyAttributes} />
      </div>
    </div>
  );
}
