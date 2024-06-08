import React, { useEffect, useState, useRef } from "react";
import { Image, Avatar, Tag, Table, Divider, Modal, Button, Spin, Collapse } from "antd";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserOutlined, CheckCircleFilled, MessageFilled } from '@ant-design/icons';
import { faImage, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatRealTime } from "./RealTime";
import toast from "react-hot-toast";

function formatCurrency(amount) {
    if (amount) {
        const strAmount = amount.toString();
        const parts = [];
        for (let i = strAmount.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
                parts.unshift(".");
            }
            parts.unshift(strAmount[i]);
        }
        return parts.join("") + "₫";
    }
    return null;
}
const getStatusTextAndColor = (status) => {
    let color;
    let text;
    switch (status) {
        case 0:
            color = "red";
            text = "Đã huỷ";
            break;
        case 1:
            color = "geekblue";
            text = "Chờ duyệt";
            break;
        case 2:
            color = "geekblue";
            text = "Đã duyệt";
            break;
        case 3:
            color = "volcano";
            text = "Chưa bắt đầu";
            break;
        case 4:
            color = "volcano";
            text = "Đang xử lý";
            break;
        case 5:
            color = "green";
            text = "Hoàn thiện";
            break;
        case 6:
            color = "green";
            text = "Kiểm thử thành";
            break;
        case 7:
            color = "green";
            text = "Hoàn tất & nhận hàng";
            break;
        default:
            color = "green";
            text = "Hoàn tất & nhận hàng";
            break;
    }
    return { color, text };
};
export default function OrderDetail() {
    const [loadingDetailOrder, setLoadingDetailOrder] = useState(false);

    const [currentChosenProduct, setCurrentChosenProduct] = useState(null);
    const ChatWithUs = ({ orderId, chatDetail }) => {
        const [currentChatText, setCurrentChatText] = useState("");
        console.log("current chat text", currentChatText)
        const [chat, setChat] = useState("");
        const [file, setFile] = useState(null);
        const handleSendChat = async (id) => {
            setCurrentChatText(chat);
            const customer = localStorage.getItem("customer");
            const token = JSON.parse(customer)?.token;
            try {
                const POST_CHAT_API = `https://e-tailorapi.azurewebsites.net/api/chat/order/${id}/send`;
                const formDta = new FormData();
                scrollToBottom();
                if (chat) {
                    formDta.append("Message", chat);
                }
                // if (file !== null) {
                //     formDta.append("MessageImages", file);
                // }
                if (imageFiles !== null) {
                    console.log("Có  Image file", imageFiles);
                    imageFiles.map((file) => {
                        formDta.append("MessageImages", file);
                    })

                }

                const response = await fetch(POST_CHAT_API, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDta
                })
                if (response.ok) {
                    setCurrentChatText("")
                    fetchChat()
                    console.log("success");
                    scrollToBottom();
                    setChat("");
                    setFile(null);

                }
            } catch (error) {
                console.log("error send chat");
            }

        }
        const handleChatChange = async (value) => {

            console.log("Chat change", value);
            setChat(value);
        }

        const chatContainerRef = useRef(null);
        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };
        useEffect(() => {
            scrollToBottom();
        }, [chatDetail]);
        const triggerFileInput = () => {
            document.getElementById('fileInput').click();
        };

        // Function to trigger image input
        const triggerImageInput = () => {
            document.getElementById('imageInput').click();
        };

        const [imageFiles, setImageFiles] = useState(null);
        console.log("Image file 1", imageFiles);

        const [previewImageChat, setPreviewImageChat] = useState(null);
        console.log("Preview image chat", previewImageChat)
        const handleImageChange = async (e) => {
            console.log("Image change", e.currentTarget.files);
            const files = Array.from(e.currentTarget.files); // Directly use the file objects
            console.log("FILES:", files)
            setImageFiles(files)
            // setImageFiles((prevResults) => {
            //     if (prevResults === null) {
            //         return files;
            //     } else {
            //         const filteredResults = files.filter(
            //             (file) => !prevResults.some((prevFile) => prevFile.name === file.name)
            //         );
            //         return [...prevResults, ...filteredResults];
            //     }
            // });

            const readers = files.map((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Correctly pass the file object
                return reader;
            });

            // Wait for all FileReader instances to complete
            const newResults = [];
            for (const reader of readers) {
                const result = await new Promise((resolve) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                });
                newResults.push(result);
            }

            setPreviewImageChat((prevResults) => {
                if (prevResults === null) {
                    return newResults;
                } else {
                    const filteredResults = newResults.filter(
                        (newResult) => !prevResults.includes(newResult)
                    );
                    return [...prevResults, ...filteredResults];
                }
            });
            // return e && e.fileList;
        }
        return (
            <div >
                <div style={{ width: 280 }}>

                    <Accordion defaultExpanded style={{ margin: 0 }}>
                        <AccordionSummary
                            expandIcon={
                                <>
                                    <ExpandMoreIcon size={20} />
                                </>
                            }
                            aria-controls="panel3-content"
                            id="panel3-header"
                            style={{ margin: 0, backgroundColor: "#f2f2f2" }}
                        >
                            <p style={{ fontWeight: 'bold', margin: "5px 0 10px 5px" }}>
                                Chat với  E-tailor

                            </p>
                        </AccordionSummary>
                        <AccordionDetails style={{ padding: 5 }}>
                            <div>
                                <div style={{ maxHeight: 300, minHeight: 200, overflowY: "scroll", scrollbarWidth: "none" }} ref={chatContainerRef}>

                                    {chatDetail?.map((chat, index) => {
                                        return (

                                            chat.fromCus ? (
                                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginBottom: 15 }} key={index}>
                                                    {chat.message && (
                                                        <div style={{
                                                            backgroundColor: "#ffe4cc",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            borderTopLeftRadius: "8px",
                                                            borderTopRightRadius: "8px",
                                                            marginRight: 5,
                                                            maxWidth: 180,
                                                            width: "fit-content",
                                                            borderBottomLeftRadius: "8px",
                                                            minHeight: "40px"
                                                        }}>
                                                            <p style={{ padding: "5px 15px 5px 15px", wordWrap: "break-word", maxWidth: 170, fontSize: 14, margin: 0 }}>{chat.message}</p>
                                                        </div>
                                                    )}

                                                    {chat?.images && (
                                                        <div style={{
                                                            backgroundColor: "#fffff",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            borderTopLeftRadius: "8px",
                                                            borderTopRightRadius: "8px",
                                                            marginRight: 5,
                                                            width: 170,
                                                            borderBottomLeftRadius: "8px",
                                                            flexWrap: "wrap",
                                                            minHeight: "40px",
                                                            justifyContent: "flex-end"
                                                        }}>
                                                            {JSON.parse(chat?.images).map((image, index) => (
                                                                <div key={index}>
                                                                    <Image
                                                                        width={55}
                                                                        height={55}
                                                                        src={image}
                                                                        style={{ objectFit: "cover" }}
                                                                        alt=""
                                                                        preview={{
                                                                            imageRender: () => (
                                                                                <div style={{
                                                                                    marginTop: "60px",
                                                                                    height: "65%",
                                                                                    overflowY: "hidden",
                                                                                }}>
                                                                                    <Image
                                                                                        width="100%"
                                                                                        height="100%"
                                                                                        style={{ objectFit: "cover" }}
                                                                                        src={image}
                                                                                    />
                                                                                </div>
                                                                            ),
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    < CheckCircleFilled style={{ color: "#ffe4cc" }} />
                                                </div>
                                            ) : (
                                                < div key={index} >
                                                    <div style={{ display: "inline-flex", marginBottom: 15, alignItems: "flex-end", width: "100%" }}>
                                                        <Avatar size="small" icon={<UserOutlined />} />
                                                        <div style={{
                                                            backgroundColor: "#f2f2f2",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            borderTopLeftRadius: "8px",
                                                            marginLeft: 10,
                                                            borderTopRightRadius: "8px",
                                                            maxWidth: 180,
                                                            width: "fit-content",
                                                            borderBottomRightRadius: "8px",
                                                            minHeight: "40px"
                                                        }}>
                                                            <p style={{ padding: "5px 15px 5px 15px ", wordWrap: "break-word", maxWidth: 170, fontSize: 14, margin: 0 }}>{chat.message}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        );
                                    })
                                    }
                                    {currentChatText && (
                                        <>

                                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginBottom: 15 }}>
                                                <div style={{ display: "block", alignContent: 'end' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{
                                                            backgroundColor: "#ffe4cc",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            borderTopLeftRadius: "8px",
                                                            borderTopRightRadius: "8px",
                                                            marginRight: 5,
                                                            maxWidth: 180,
                                                            width: "fit-content",
                                                            borderBottomLeftRadius: "8px",
                                                            minHeight: "40px"
                                                        }}>
                                                            <p style={{ padding: "5px 15px 5px 15px", fontSize: 14, margin: 0 }}>{currentChatText}</p>
                                                        </div>
                                                        <MessageFilled style={{ color: "#ffe4cc" }} />
                                                    </div>
                                                    <span style={{ fontSize: 10 }}>Đang gửi...</span>
                                                </div>
                                            </div>

                                        </>
                                    )}

                                </div>

                                <div
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#f2f2f2",
                                        borderRadius: 5,
                                        position: "relative",
                                    }}
                                >
                                    {previewImageChat && (
                                        <div style={{ display: "flex", overflowX: "scroll", scrollbarWidth: "thin" }}>
                                            {previewImageChat.map((image, index) => (
                                                <div style={{ paddingLeft: 5, paddingTop: 5, borderRadius: 5 }} key={index}>
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={image}
                                                        style={{ objectFit: "cover" }}
                                                        alt=""
                                                        preview={{
                                                            imageRender: () => (
                                                                <div
                                                                    style={{
                                                                        marginTop: "60px",
                                                                        height: "65%",
                                                                        overflowY: "hidden",
                                                                    }}
                                                                >
                                                                    <Image
                                                                        width="100%"
                                                                        height="100%"
                                                                        style={{ objectFit: "cover" }}
                                                                        src={image}
                                                                    />
                                                                </div>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", borderRadius: 5, width: 260 }}>
                                        <textarea rows={2}
                                            className="textarea-chat"
                                            name="chat"
                                            placeholder=" Aa"
                                            value={chat}
                                            disabled={orderDetails.status === 0 || orderDetails.status === 7 ? true : false}
                                            maxLength={500}
                                            onChange={(e) => handleChatChange(e.target.value)}
                                            onKeyDown={(e) => e.key === 13 && e.shiftKey === false ? handleSendChat(orderId) : null}
                                        ></textarea>

                                        <div style={{ marginLeft: "20px" }}>
                                            <SendIcon sx={{
                                                color: '#D9D9D9', cursor: "pointer", '&:hover': {
                                                    color: '#2474fc'
                                                }
                                            }}
                                                onClick={() => handleSendChat(orderId)} fontSize="small" />
                                        </div>
                                    </div>
                                    <div style={{ margin: "5px 0px 5px 15px", paddingBottom: 5 }}>
                                        <FontAwesomeIcon icon={faImage} color="#D9D9D9" style={{ cursor: "pointer" }} onClick={triggerImageInput} />
                                        <FontAwesomeIcon icon={faPaperclip} color="#D9D9D9" style={{ marginLeft: 15, cursor: "pointer" }} onClick={triggerFileInput} />
                                        <input type="file" id="imageInput" disabled={orderDetails.status === 0 || orderDetails.status === 7 ? true : false} accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />

                                        {/* Hidden file input */}
                                        <input type="file" id="fileInput" disabled={orderDetails.status === 0 || orderDetails.status === 7 ? true : false} style={{ display: 'none' }} onChange={event => console.log(event.target.files)} />

                                    </div>

                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                </div>
            </div >
        )
    }
    const [orderDetails, setOrderDetails] = useState(null);
    const { id } = useParams();
    const [getAllChat, setGetAllChat] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log("Get all chat", getAllChat);
    const fetchChat = async () => {
        const customer = localStorage.getItem("customer");
        const token = JSON.parse(customer)?.token;
        const GET_CHAT_API = `https://e-tailorapi.azurewebsites.net/api/chat/order/${id}`;
        try {

            const response = await fetch(
                GET_CHAT_API,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const chatData = await response.json();
            setGetAllChat(chatData?.chatLists);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    }
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoadingDetailOrder(true);
                const customer = localStorage.getItem("customer");
                const token = JSON.parse(customer)?.token;
                const response = await fetch(
                    `https://e-tailorapi.azurewebsites.net/api/order/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    setLoadingDetailOrder(false);
                    const orderDetailsData = await response.json();
                    setOrderDetails(orderDetailsData);
                }

            } catch (error) {
                console.error("Error fetching order details:", error);
                setLoadingDetailOrder(false);
            }
        };

        fetchOrderDetails();

        fetchChat()
    }, [id]);

    const chatNotification = ChatRealTime();
    useEffect(() => {
        if (chatNotification) {
            console.log("Có tin nhắn :,", chatNotification)
            fetchChat()
        }
    }, [chatNotification]);
    console.log("Chat notification,", chatNotification)
    if (!orderDetails) {
        return <p>Loading...</p>;
    }


    const parsedStatus = getStatusTextAndColor(orderDetails.status);
    const showModal = (data) => {
        setIsModalOpen(true);
        setCurrentChosenProduct(data.id)
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: 350,
            render: (text) => <p style={{ fontWeight: 'bold' }}>{text}</p>,
        },
        {
            title: 'Hình ảnh',
            width: 200,
            dataIndex: 'image',
            align: 'center',
            key: 'image',
            render: (imgSrc) => {
                return (
                    <Image
                        width={100}
                        height={100}
                        src={imgSrc}
                        style={{ objectFit: "cover" }}
                        alt=""
                        preview={{
                            imageRender: () => (
                                <div
                                    style={{
                                        marginTop: "60px",
                                        height: "65%",
                                        overflowY: "hidden",
                                    }}
                                >
                                    <Image
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: "cover" }}
                                        src={imgSrc}
                                    />
                                </div>
                            ),
                        }}
                    />
                );
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 100,
            key: 'quantity',
        },
        {
            title: 'Tổng cộng',
            dataIndex: 'price',
            width: 200,
            key: 'price',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: "",
            dataIndex: '',
            key: 'x',
            render: (data) => (
                <p className="btn-view-more" onClick={() => showModal(data)} type="primary">Xem chi tiết</p>
            ),
            width: 150,
        }

    ];
    const data = orderDetails?.products.map((order, index) => ({
        index: index + 1,
        id: order.id,
        key: order.id,
        productName: order?.templateName ? order.templateName : "",
        note: order?.note ? order.note : "Không có ghi chú",
        quantity: order?.totalProduct ? order.totalProduct : "x1",
        price: order?.price ? formatCurrency(order.price) : "0đ",
        image: order?.templateThumnailImage ? order.templateThumnailImage : "",

    }));

    const ProductDetailModal = ({ product, isModalOpen, handleOk, orderId, handleCancel }) => {
        console.log("Product", product)
        const [productDetail, setProductDetail] = useState(null);
        const [loadingDetail, setLoadingDetail] = useState(false);
        useEffect(() => {
            if (!(product && orderId)) return;

            const PRODUCT_DETAIL_URL = `https://e-tailorapi.azurewebsites.net/api/product/order/${orderId}/${product}`;
            const fetchProductDetail = async () => {
                setLoadingDetail(true);
                try {
                    const response = await fetch(PRODUCT_DETAIL_URL, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("customer"))?.token}`,

                        },

                    });
                    if (response.ok) {
                        const data = await response.json();
                        setLoadingDetail(false);
                        console.log("Product detail:", data);
                        setProductDetail(data);
                    }
                } catch (error) {
                    console.error("Error fetching product detail:", error);
                    setLoadingDetail(false);
                    toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
                }
            }
            fetchProductDetail();
        }, [product, orderId]);
        return (
            <>
                <Modal
                    title="Thông tin sản phẩm"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Đóng
                        </Button>,
                    ]}
                    style={{ marginTop: 20 }}
                    width={700}
                    height={500}
                >
                    {loadingDetail ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                            <Spin />
                        </div>
                    ) : (
                        <div style={{ marginTop: 20 }}>
                            <div>
                                {/* <div>
                                    <p className="has-text-weight-semibold" style={{ padding: "5px 15px 5px 15px", fontSize: 15 }}>
                                        <Tag color={parsedStatus.color}>{parsedStatus.text}</Tag>
                                    </p>
                                </div> */}

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <p className="title is-5" style={{ margin: 10, fontSize: 15, fontWeight: "bold", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", width: 130, textWrap: "nowrap" }}>
                                            Tên sản phẩm: <span style={{ fontWeight: "400", paddingLeft: 5 }}>{productDetail?.productTemplateName}</span>
                                        </p>
                                        <p className="title is-5" style={{ margin: 10, fontSize: 15, fontWeight: "bold" }}>
                                            Ghi chú: <span style={{ fontWeight: "400", paddingLeft: 5 }}>{productDetail?.note ? (productDetail?.note) : ("Không có ghi chú")}</span>
                                        </p>
                                        {productDetail?.quantity && (
                                            <p className="title is-5" style={{ margin: 10, fontSize: 15 }}>
                                                Số lượng vải sử dụng: <span style={{ fontWeight: "bold", paddingLeft: 5 }}>{productDetail?.quantity}</span>
                                            </p>
                                        )}
                                        {productDetail?.fabricMaterial && (
                                            <p className="title is-5" style={{ margin: 10, fontSize: 15, fontWeight: "bold" }}>
                                                Vải sử dụng :<span style={{ fontWeight: "400", paddingLeft: 5 }}>{productDetail?.fabricMaterial.name}</span>
                                            </p>
                                        )}

                                    </div>
                                    <div style={{ marginRight: "20px" }}>
                                        <Image
                                            width={150}
                                            height={100}
                                            src={productDetail?.productTemplateImage}
                                            style={{ objectFit: "cover", borderRadius: 5 }}
                                            alt=""
                                            preview={{
                                                imageRender: () => (
                                                    <div style={{
                                                        marginTop: "60px",
                                                        height: "65%",
                                                        overflowY: "hidden",
                                                    }}>
                                                        <Image
                                                            width="100%"
                                                            height="100%"
                                                            style={{ objectFit: "cover" }}
                                                            src={productDetail?.productTemplateImage}
                                                        />
                                                    </div>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>

                                <Divider />
                                <div>
                                    <p className="has-text-weight-semibold" style={{ padding: 5, fontSize: 15 }}>Chi tiết các bộ phận:</p>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', overflowY: "scroll", scrollbarWidth: "none" }}>
                                        {productDetail?.componentTypeOrders.length !== 0 ? (
                                            productDetail?.componentTypeOrders.map((component, index) => (
                                                <div key={index} style={{ marginBottom: "20px", flex: '1 0 45%' }}>
                                                    <p className="has-text-weight-semibold" style={{ padding: 5, fontSize: 15 }}>{index + 1}.{component.name}</p>
                                                    {component?.components.map((item, index) => (
                                                        <>
                                                            <div key={index} style={{ display: "flex", width: "100%", marginLeft: "10px", marginTop: 5 }}>
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={item.image}
                                                                    style={{ objectFit: "cover", borderRadius: 5 }}
                                                                    alt=""
                                                                    preview={{
                                                                        imageRender: () => (
                                                                            <div style={{
                                                                                marginTop: "60px",
                                                                                height: "65%",
                                                                                overflowY: "hidden",
                                                                            }}>
                                                                                <Image
                                                                                    width="100%"
                                                                                    height="100%"
                                                                                    style={{ objectFit: "cover" }}
                                                                                    src={item.image}
                                                                                />
                                                                            </div>
                                                                        ),
                                                                    }}
                                                                />
                                                                <p style={{ fontSize: 14, paddingLeft: 10 }}>{item.name}</p>

                                                            </div>
                                                            <div style={{ paddingTop: 5 }}>

                                                                {component?.noteObject && (
                                                                    <p style={{ fontSize: 14, paddingLeft: 10, wordBreak: "break-word" }}>Ghi chú: {component?.noteObject?.note}</p>
                                                                )}
                                                            </div>
                                                        </>
                                                    ))}

                                                </div>
                                            ))
                                        ) : (
                                            <p>Không có thông tin</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal >
            </>
        )
    }

    const items = [
        {
            key: '1',
            label: (
                <p className="title is-5" style={{ margin: 0, fontSize: 17, fontWeight: "bold" }}>
                    Mã đơn: <span style={{ fontWeight: "bold" }}>{orderDetails.id} </span>
                </p>
            ),
            children: (
                <>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundClip: "#f0f4fc",
                            padding: 15,
                        }}
                    >
                        <div>

                            <p>Tên khách hàng : <span style={{ fontWeight: "bold" }}>{orderDetails?.customer?.fullname}</span></p>
                            {orderDetails?.customer?.phone && (
                                <p>Số điện thoại : <span style={{ fontWeight: "bold" }}>{orderDetails?.customer?.phone}</span></p>
                            )}
                            <p>Tổng sản phẩm : <span style={{ fontWeight: "bold" }}>{orderDetails?.totalProduct}</span></p>
                        </div>

                        <p className="has-text-weight-semibold" style={{ fontSize: 17 }}>
                            Trạng thái: <Tag color={parsedStatus.color}>{parsedStatus.text}</Tag>
                        </p>

                    </div>
                    <div style={{ padding: 15, }}>
                        <Table columns={columns} dataSource={data} bordered />
                    </div>
                </>
            ),
        },
        {
            key: '2',
            label: (
                <p className="title is-5" style={{ margin: 0, fontSize: 17, fontWeight: "bold" }}>
                    Danh mục nguyên liệu
                </p>
            ),
            children: (
                <div style={{ padding: 15, backgroundColor: 'rgb(250, 250, 250)', margin: 15 }}>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: 10 }}>
                        {orderDetails?.orderMaterials && orderDetails.orderMaterials.map((item, index) => (
                            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", position: "relative" }}>
                                <div>
                                    {item?.isCusMaterial ? (
                                        <>
                                            <p style={{ fontWeight: "bold", padding: 5 }} >Vải dùng : <span style={{ fontWeight: '400' }}>Vải của khách</span></p>
                                            <p style={{ fontWeight: "bold", padding: 5 }}>Vải đã nhận:  <span style={{ fontWeight: '400' }}>{item.value} mét</span> </p>
                                        </>
                                    ) : (
                                        <p style={{ fontWeight: "bold", padding: 5 }}>Vải dùng : <span style={{ fontWeight: "400" }}>Vải của cửa hàng</span></p>
                                    )}
                                    <p style={{ fontWeight: "bold", padding: 5 }}>Số lượng vải đã sử dụng : <span style={{ fontWeight: "400" }}>{item.valueUsed} mét</span></p>
                                </div>
                                {item?.material && (
                                    <>
                                        <p style={{ fontWeight: "bold", padding: 5 }}>Màu vải:  <span style={{ fontWeight: "400" }}> {item.material.name}</span></p>
                                        <div style={{ position: "absolute", top: "50%", right: "15px", transform: "translateY(-50%)" }}>
                                            <Image
                                                width={80}
                                                height={80}
                                                src={item.material.image}
                                                style={{ objectFit: "cover", borderRadius: 5, }}
                                                alt=""
                                                preview={{
                                                    imageRender: () => (
                                                        <div style={{
                                                            marginTop: "60px",
                                                            height: "65%",
                                                            overflowY: "hidden",
                                                        }}>
                                                            <Image
                                                                width="100%"
                                                                height="100%"
                                                                style={{ objectFit: "cover" }}
                                                                src={item.material.image}
                                                            />
                                                        </div>
                                                    ),
                                                }}
                                            />
                                        </div>

                                    </>
                                )}
                            </div>
                        ))}
                    </div>






                </div>
            ),
        },
        {
            key: '3',
            label: (
                <p className="title is-5" style={{ margin: 0, fontSize: 17, fontWeight: "bold" }}>
                    Thanh toán
                </p>
            ),
            children: (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div style={{ padding: 10, width: "400px", }}>
                        <p style={{ fontWeight: "bold" }}>Tổng tiền : <span style={{ fontWeight: "400" }}>{formatCurrency(orderDetails?.totalPrice)}</span></p>
                    </div>

                    <div style={{ padding: 10, width: "400px" }}>
                        <p style={{ fontWeight: "bold" }}>Đã cọc : <span style={{ fontWeight: "400" }}>{orderDetails?.deposit ? formatCurrency(orderDetails?.deposit) : "Không cọc"}</span></p>
                    </div>

                    <div style={{ padding: 10, width: "400px" }}>
                        <p style={{ fontWeight: "bold" }}>Giảm giá: <span style={{ fontWeight: "400" }}>{orderDetails?.discountPrice ? formatCurrency(orderDetails?.discountPrice) : "Không"}</span></p>
                    </div>

                    <div style={{ padding: 10, width: "400px" }}>
                        <p style={{ fontWeight: "bold" }}>Sau khi giảm: <span style={{ fontWeight: "400" }}>{formatCurrency(orderDetails?.afterDiscountPrice)}</span></p>
                    </div>

                    {
                        orderDetails?.unPaidMoney ? (
                            <>
                                <div style={{ color: "red", padding: 10, width: "400px" }}>
                                    <p>CHƯA THANH TOÁN : <span style={{ fontWeight: "bold" }}>{orderDetails?.unPaidMoney && formatCurrency(orderDetails?.unPaidMoney)}</span></p>
                                </div>
                                <Divider />
                            </>
                        ) : (
                            <>
                                <div style={{ color: "green", padding: 10, width: "400px", fontWeight: "bold" }}>
                                    <p>ĐÃ THANH TOÁN</p>
                                </div>
                                <Divider />
                            </>
                        )
                    }
                </div>
            )
        }
    ];
    return (
        <>

            {loadingDetailOrder ? (
                <div style={{ paddingTop: "300px", display: "flex", justifyContent: "center" }}>
                    <Spin />
                </div>
            ) : (
                <div
                    style={{
                        padding: "140px 20px 0 20px",
                        display: "flex",
                        position: "relative",
                        alignContent: "center",
                    }}
                >
                    {isModalOpen && <ProductDetailModal product={currentChosenProduct} isModalOpen={isModalOpen} handleOk={handleOk} orderId={id} handleCancel={handleCancel} />}

                    <div
                        style={{
                            width: "80%",
                            height: "fit-content",
                            position: "relative",
                            margin: "auto",
                            borderRadius: 5,
                            border: "1px solid #f0f4fc",
                        }}
                    >

                        <Collapse defaultActiveKey={1} items={items} />


                    </div>
                    <div style={{ position: "fixed", bottom: 10, right: 120, zIndex: 1 }}>
                        <ChatWithUs orderId={id} chatDetail={getAllChat} />
                    </div>
                    {/* <div
                        style={{
                            overflowX: "hidden",
                            height: "fit-content",
                            position: "absolute",
                            top: "200px",
                            right: "60px",
                        }}
                    >
                        <img
                            src={RightBanner}
                            alt="Right Banner"
                            width={200}
                            loading="lazy"
                        />
                    </div> */}

                </div >
            )
            }

        </>
    );
}
