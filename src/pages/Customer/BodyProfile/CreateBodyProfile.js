import React, { useState } from 'react';
import { Button, Form, Modal, InputNumber } from "antd";
import { useQuery, useQueryClient, queryClient } from 'react-query';
import Loading from '../LoadingComponent/loading';
import BangSize from '../../../assets/images/bangsize.jpg'
import { useNavigate } from "react-router-dom";
import './index.css'
import Swal from "sweetalert2";



export const CreateBodyProfile = ({ isModalOpen, getAllBodyAttributes, isLoading, handleCancel }) => {

    const navigate = useNavigate()
    const [validationMessages, setValidationMessages] = useState({});
    const [inputValues, setInputValues] = useState([]);
    const [bodyProfileName, setBodyProfileName] = useState('')
    const handleInputBodyProfileName = (value) => {
        setBodyProfileName(value)
    }
    const validateInput = (id, value) => {
        const attribute = getAllBodyAttributes.find(item => item.id === id);
        if (!attribute) return;

        const min = parseFloat(attribute.minValidValue);
        const max = parseFloat(attribute.maxValidValue);
        const parsedValue = parseFloat(value);
        const isValid = !isNaN(parsedValue) && parsedValue >= min && parsedValue <= max && value.trim() !== '';

        setValidationMessages(prevState => ({
            ...prevState,
            [id]: isValid ? '' : `Số đo từ ${min} ~ ${max} cm`
        }));
    };
    const handleInputChange = (attributeId, value) => {
        const existingIndex = inputValues.findIndex(item => item.id === attributeId);

        if (existingIndex !== -1) {
            setInputValues(prevState => {
                const newState = [...prevState];
                newState[existingIndex].value = value;
                validateInput(attributeId, value);
                return newState;
            });
        } else {
            setInputValues(prevState => [
                ...prevState,
                { id: attributeId, value: value }
            ]);
            validateInput(attributeId, value);
        }
    };
    const [form] = Form.useForm();
    const [guideImg, setGuideImg] = useState(BangSize);
    const handleFocusOut = () => {
        setGuideImg(BangSize)
    }
    const handleImageGuide = (id) => {
        const attribute = getAllBodyAttributes.filter(item => item.id === id);
        setGuideImg(attribute[0]?.image);
    };
    const handleCreateBodySize = async () => {
        const PROFILE_URL = `https://etailorapi.azurewebsites.net/api/profile-body`
        const customer = localStorage.getItem("customer")
        const token = JSON.parse(customer)?.token
        try {
            const response = await fetch(PROFILE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": " application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: bodyProfileName,
                    valueBodyAttribute: inputValues,
                }),
            });

            if (response.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Tạo mới thành công",
                    timer: 2000,
                });
                navigate('/body-profile')
                handleCancel()
            }
            else {
                const errorText = await response.text()

            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
        }
    }

    const customer = localStorage.getItem("customer")
    const token = JSON.parse(customer)?.token

    const { data: getBodyAttributesDetail, Loading } = useQuery("get-all-body-profile", () =>
        fetch(`https://etailorapi.azurewebsites.net/api/profile-body/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.json())
    );

    return (
        <Modal
            open={isModalOpen}
            onOk={handleCreateBodySize}
            cancelText='Huỷ'
            okText='Thêm mới'
            title='Thêm mới số đo'
            onCancel={handleCancel}
            style={{ top: "150px", color: "#9F78FF", maxHeight: 550, overflow: "hidden" }}
            width={900}
        >
            {isLoading ? (
                <Loading />
            ) : (

                <div >

                    <hr style={{ margin: 10 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "50% 50%", paddingLeft: 20, paddingRight: 20 }}>

                        <div>
                            <div style={{ paddingBottom: 20 }}>
                                <label className='title is-4 is-underlined' style={{ display: "block", margin: 0, paddingBottom: 15 }}>
                                    <span style={{ color: "red" }}>*</span>Tên số đo
                                </label>
                                <input className="input is-normal" value={bodyProfileName}
                                    onChange={(e) => handleInputBodyProfileName(e.target.value)} name='name' type="text" autoComplete='off' placeholder="Vd: Số đo áo sơ mi" />
                            </div>
                            <p className='title is-4 is-underlined' style={{ margin: 0, paddingBottom: 5 }}>Các chỉ số</p>
                            <div style={{
                                height: 300,
                                overflowY: "scroll",
                            }}>
                                {Array.from({ length: 3 }, (_, i) => i + 1).map((index) => (
                                    <div key={index}>
                                        <p className='title is-3' style={{ margin: 0, padding: "10px 0 10px 10px" }}>
                                            {index === 1 ? "I. Phần đầu" : index === 2 ? "II. Phần thân trên" : "III. Phần thân dưới"}
                                        </p>
                                        {getAllBodyAttributes && getAllBodyAttributes.map((attribute, attrIndex) => {
                                            if (attribute?.bodyIndex === index) {
                                                return (
                                                    <div key={attrIndex} className="field" style={{ paddingLeft: "20px" }}>
                                                        <div style={{ alignItems: "center", paddingLeft: 5, display: "flex", paddingBottom: 5 }}>
                                                            <label className='title is-3 ' style={{ display: "block", margin: 0, width: 150 }}>
                                                                {attribute.name}
                                                            </label>
                                                            {validationMessages[attribute.id] && (
                                                                <p style={{ color: "red", marginLeft: 10 }}>{validationMessages[attribute.id]}</p>
                                                            )}
                                                        </div>

                                                        <input
                                                            className="input is-normal"
                                                            autoComplete='off'
                                                            onClick={() => { handleImageGuide(attribute.id) }}
                                                            name={`${attribute.id}`}
                                                            type="text"
                                                            placeholder={`${attribute.minValidValue}~${attribute.maxValidValue} cm`}
                                                            style={{ height: 35, textAlign: "center", borderRadius: 5, width: 300 }}
                                                            onChange={(e) => handleInputChange(attribute.id, e.target.value)}
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
                        <div style={{ width: "100%", borderRadius: "10px", textAlign: "center", }}>
                            <div style={{ display: "grid", paddingLeft: 20, placeItems: "center", height: "100%", overflowY: "hidden", maxHeight: "400px" }}>
                                <img src={guideImg} style={{ objectFit: "cover", width: "400px", borderRadius: "10px", boxShadow: "5px 5px 10px #88888858" }} alt="Guide" />
                            </div>

                        </div>
                    </div>
                </div>
            )
            }
        </Modal >
    );
};