import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import DefaultImg from '../../../assets/images/ao-so-mi/2675-(1).jpg'
import {
  Button, Form, Modal,
  Card,
  Col,
  Row,
  message,
  Steps,
  theme,
  Space,
  Select,
  Upload,
  Radio,
} from "antd";
import { Input } from "antd";
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  InputNumber,
  DatePicker,
} from "antd";
import { useQuery } from 'react-query'

export default function BodyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(0);
  const [guideImg, setGuideImg] = useState('')
  const customer = localStorage.getItem("customer")
  const token = JSON.parse(customer)?.token
  const { data: getAllBodyAttributes, isLoading } = useQuery("get-all-bodyAtrributes", () =>
    fetch(`https://etailorapi.azurewebsites.net/api/body-size`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json())
  );
  const attributes = getAllBodyAttributes?.map((attribute, index) => ({
    id: attribute.id,
    name: attribute?.name ? attribute.name : "",
    bodyPart: attribute?.bodyPart ? attribute.bodyPart : "",
    bodyIndex: attribute?.bodyIndex ? attribute.bodyIndex : "",
    image: attribute?.image ? attribute.image : "",
    guideVideoLink: attribute?.guideVideoLink ? attribute.guideVideoLink : "",
    minValidValue: attribute?.minValidValue ? attribute.minValidValue : "",
    maxValidValue: attribute?.maxValidValue ? attribute.maxValidValue : "",
  }))
  console.log("Cling Image:", guideImg)
  const handleImageGuide = (id) => {
    const attribute = attributes.filter(item => item.id === id)
    console.log("clicng id:", attribute)
    setGuideImg(attribute[0].image)
  }
  console.log("ALL attributes:", (attributes))
  const FormItem = ({ attribute }) => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('inline');
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };
    const formItemLayout =
      formLayout === 'horizontal'
        ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
        : null;
    return (
      <Form.Item
        className="mt-2"
        hasFeedback
        name={attribute.name}
        label={attribute.name}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 26 }}
        rules={[
          {
            type: 'number',
            max: attribute.maxValidValue ? parseFloat(attribute.maxValidValue) : undefined,
            min: attribute.minValidValue ? parseFloat(attribute.minValidValue) : undefined,
            message: `Số đo trong khoảng ${attribute.minValidValue} tới ${attribute.maxValidValue} (cm) `,
          },
        ]}
      >
        <Input id={attribute.id} suffix="cm" onClick={() => handleImageGuide(attribute.id)} />
      </Form.Item>
    )
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p className='title is-2'>Hồ sơ số đo</p>
      </div>
      <Button
        type="primary"
        onClick={showModal}
      >
        Thêm mới
      </Button>
      <Modal open={isModalOpen} cancelText='Huỷ' okText='Thêm mới' onOk={handleOk} onCancel={handleCancel} style={{ top: "150px", color: "#9F78FF" }} width={900}>
        <div style={{ display: "grid", gridTemplateColumns: "60% 40%", padding: "20px" }}>
          <div>
            <Form
              style={{
                height: 300,
                width: '50%',
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",

              }}
              layout="horizontal"
              name="form_in_modal"
              initialValues={{
                modifier: "public",
              }}
            >
              <p className='title is-5' style={{ margin: 0 }}>I. Phần đầu</p>
              {attributes && attributes.map((attribute, index) => {
                if (attribute?.bodyIndex === 1) {
                  return (
                    <FormItem attribute={attribute} form={form} />
                  )
                }
              }
              )}
              <p className='title is-5' style={{ margin: 0 }}>II. Phần thân trên</p>
              {attributes && attributes.map((attribute, index) => {
                if (attribute?.bodyIndex === 2) {
                  return (
                    <FormItem attribute={attribute} form={form} />
                  )
                }
              }
              )}
              <p className='title is-5' style={{ margin: 0 }}>III. Phần thân dưới</p>
              {attributes && attributes.map((attribute, index) => {
                if (attribute?.bodyIndex === 3) {
                  return (
                    <FormItem attribute={attribute} form={form} />
                  )
                }
              }
              )}
            </Form>
          </div>
          <div style={{ width: "100%", overflowY: "hidden", maxHeight: "300px", borderRadius: "10px" }}>
            <img src={guideImg} ></img>
          </div>
        </div>


      </Modal >
      <div style={{ width: "100%", paddingTop: "20px" }}>
        <table className="table" style={{ width: "100%" }}>
          <thead >
            <tr >
              <th style={{ color: "#9F78FF" }}>Mã số đo</th>
              <th style={{ color: "#9F78FF" }}>Tên số đo</th>
              <th style={{ color: "#9F78FF" }}>Người đo</th>
              <th style={{ color: "#9F78FF" }}>Ngày đo</th>
              <th style={{ color: "#9F78FF" }}>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>c12302v3432</th>
              <td>Hồ sơ 1</td>
              <td>Nguyễn Công Vũ</td>
              <td>12/10/2024</td>
              <td style={{ display: "flex" }}>
                <div>
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div style={{ paddingLeft: "20px" }}>
                  <FontAwesomeIcon icon={faPencil} />
                </div>
              </td>
            </tr>
            <tr>
              <th>c12302v3432</th>
              <td>Hồ sơ 1</td>
              <td>Nguyễn Công Vũ</td>
              <td>12/10/2024</td>
              <td style={{ display: "flex" }}>
                <div>
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div style={{ paddingLeft: "20px" }}>
                  <FontAwesomeIcon icon={faPencil} />
                </div>
              </td>
            </tr>
            <tr>
              <th>c12302v3432</th>
              <td>Hồ sơ 1</td>
              <td>Nguyễn Công Vũ</td>
              <td>12/10/2024</td>
              <td style={{ display: "flex" }}>
                <div>
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div style={{ paddingLeft: "20px" }}>
                  <FontAwesomeIcon icon={faPencil} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div >
  )
}
