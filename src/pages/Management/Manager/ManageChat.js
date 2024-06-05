import React, { useState, useRef, useEffect } from "react";
import { Image, Avatar, Typography, Input } from "antd";
import {
  UserOutlined,
  CheckCircleFilled,
  MessageFilled,
  CloseOutlined,
} from "@ant-design/icons";
import SendIcon from "@mui/icons-material/Send";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { ChatRealTimeManager } from "./ChatRealTimeManager";
import Swal from "sweetalert2";

const { Title } = Typography;
const { TextArea } = Input;

function ManageChat({
  orderId,
  chatDetail,
  fetchChat,
  dataOrderDetail,
  setChatWithCustomer,
  setBadgeChatCount,
}) {
  const [currentChatText, setCurrentChatText] = useState("");
  const [chat, setChat] = useState("");
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewImageChat, setPreviewImageChat] = useState(null);

  const chatNotification = ChatRealTimeManager();
  const { messageReturn, resetMessageReturn } = chatNotification;

  useEffect(() => {
    if (messageReturn) {
      fetchChat();
      resetMessageReturn();
    }
  }, [messageReturn, resetMessageReturn]);
  console.log("dataOrderDetail", dataOrderDetail);
  const handleSendChat = async (id) => {
    setCurrentChatText(chat);
    if (previewImageChat !== null) {
      setCurrentImage(previewImageChat);
    }
    const manager = localStorage.getItem("manager");
    const token = JSON.parse(manager)?.token;
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
        imageFiles.map((file) => {
          formDta.append("MessageImages", file);
        });
      }

      const response = await fetch(POST_CHAT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDta,
      });

      if (response.ok || response.status === 200) {
        setCurrentChatText("");
        setCurrentImage(null);
        setPreviewImageChat(null);
        fetchChat();
        setBadgeChatCount(0);
        scrollToBottom();
        setChat("");
        setFile(null);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
      }
    } catch (error) {
      console.log("error send chat");
    }
  };
  const handleChatChange = async (value) => {
    setChat(value);
  };

  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatDetail]);
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  // Function to trigger image input
  const triggerImageInput = () => {
    document.getElementById("imageInput").click();
  };

  const [imageFiles, setImageFiles] = useState(null);

  const handleImageChange = async (e) => {
    const files = Array.from(e.currentTarget.files); // Directly use the file objects
    setImageFiles(files);
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
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "scroll",
        scrollbarWidth: "none",
        WebkitScrollbar: "none",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#5c429e",
              height: 70,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={
                  dataOrderDetail?.customer?.avatar
                    ? dataOrderDetail?.customer?.avatar
                    : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                }
                size="large"
              />
              <Title
                level={4}
                style={{ marginLeft: 10, marginBottom: 0, color: "white" }}
              >
                {dataOrderDetail?.customer?.fullname}
              </Title>
            </div>
            <div>
              <CloseOutlined
                style={{ color: "white", fontSize: 30, cursor: "pointer" }}
                onClick={() => setChatWithCustomer(false)}
              />
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              maxHeight: 300,
              minHeight:
                dataOrderDetail &&
                (dataOrderDetail.status === 0 || dataOrderDetail.status === 8)
                  ? 564
                  : 484,
              overflowY: "scroll",
              scrollbarWidth: "none",
              padding: 10,
            }}
            ref={chatContainerRef}
          >
            {chatDetail?.map((chat, index) => {
              return !chat.fromCus ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: 15,
                  }}
                  key={index}
                >
                  {chat?.images && (
                    <div
                      style={{
                        backgroundColor: "#fffff",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        marginRight: 5,
                        width: 350,
                        borderBottomLeftRadius: "8px",
                        flexWrap: "wrap",
                        minHeight: "40px",
                      }}
                    >
                      {JSON.parse(chat?.images).map((image, index) => (
                        <div
                          key={index}
                          style={{
                            paddingLeft: 5,
                            paddingTop: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Image
                            width={55}
                            height={55}
                            src={image}
                            style={{ objectFit: "cover" }}
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {chat.message && (
                    <div
                      style={{
                        backgroundColor: "#9F78FF",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        marginRight: 5,
                        maxWidth: 350,
                        width: "fit-content",
                        borderBottomLeftRadius: "8px",
                        minHeight: "40px",
                      }}
                    >
                      <p
                        style={{
                          padding: "5px 15px 5px 15px",
                          wordWrap: "break-word",
                          color: "white",
                          maxWidth: 340,
                          fontSize: 14,
                          margin: 0,
                        }}
                      >
                        {chat.message}
                      </p>
                    </div>
                  )}

                  <CheckCircleFilled style={{ color: "#9F78FF" }} />
                </div>
              ) : (
                <>
                  <div key={index}>
                    <div
                      style={{
                        display: "inline-flex",
                        marginBottom: 15,
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Avatar size="small" icon={<UserOutlined />} />
                      <div
                        style={{
                          backgroundColor: "#f2f2f2",
                          display: "flex",
                          alignItems: "center",
                          borderTopLeftRadius: "8px",
                          marginLeft: 10,
                          borderTopRightRadius: "8px",
                          maxWidth: 350,
                          width: "fit-content",
                          borderBottomRightRadius: "8px",
                          minHeight: "40px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex" }}>
                            {chat?.images &&
                              JSON.parse(chat?.images)?.map((img) => {
                                return (
                                  <div
                                    style={{
                                      paddingLeft: 5,
                                      paddingTop: 5,
                                      paddingBottom: chat.message ? 5 : "",
                                      paddingRight: 5,
                                      borderRadius: 5,
                                    }}
                                  >
                                    <Image
                                      width={55}
                                      height={55}
                                      src={img}
                                      style={{ objectFit: "cover" }}
                                      alt=""
                                    />
                                  </div>
                                );
                              })}
                          </div>

                          <p
                            style={{
                              padding: "5px 5px 5px 15px ",
                              wordWrap: "break-word",
                              maxWidth: 350,
                              fontSize: 14,
                              margin: 0,
                            }}
                          >
                            {chat.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            {currentImage && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: 15,
                  }}
                >
                  <div style={{ display: "block", alignContent: "end" }}>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                          marginRight: 5,
                          maxWidth: 350,
                          width: "fit-content",
                          borderBottomLeftRadius: "8px",
                          minHeight: "40px",
                        }}
                      >
                        {currentImage?.map((image) => {
                          return (
                            <div
                              style={{
                                paddingLeft: 5,
                                paddingTop: 5,
                                borderRadius: 5,
                              }}
                            >
                              <Image
                                width={55}
                                height={55}
                                src={image}
                                style={{ objectFit: "cover" }}
                                alt=""
                              />
                            </div>
                          );
                        })}
                      </div>
                      <MessageFilled style={{ color: "#9F78FF" }} />
                    </div>
                    <span style={{ fontSize: 10 }}>Đang gửi...</span>
                  </div>
                </div>
              </>
            )}
            {currentChatText && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: 15,
                  }}
                >
                  <div style={{ display: "block", alignContent: "end" }}>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          backgroundColor: "#9F78FF",
                          display: "flex",
                          alignItems: "center",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                          marginRight: 5,
                          maxWidth: 350,
                          width: "fit-content",
                          borderBottomLeftRadius: "8px",
                          minHeight: "40px",
                        }}
                      >
                        <p
                          style={{
                            padding: "5px 15px 5px 15px",
                            fontSize: 14,
                            color: "white",
                            margin: 0,
                          }}
                        >
                          {currentChatText}
                        </p>
                      </div>
                      <MessageFilled style={{ color: "#9F78FF" }} />
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
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              position: "relative",
            }}
          >
            {previewImageChat && (
              <div
                style={{
                  display: "flex",
                  overflowX: "scroll",
                  scrollbarWidth: "thin",
                }}
              >
                {previewImageChat.map((image, index) => (
                  <div
                    style={{
                      paddingLeft: 5,
                      paddingTop: 5,
                      borderRadius: 5,
                    }}
                  >
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
            {dataOrderDetail.status === 0 || dataOrderDetail.status === 8 ? (
              ""
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #D9D9D9",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: "4px",
                  marginTop: 1,
                  backgroundColor: "#5c429e",
                }}
              >
                <TextArea
                  maxLength={500}
                  value={chat}
                  onChange={(e) => handleChatChange(e.target.value)}
                  placeholder="Aa"
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  style={{ border: "none", borderRadius: "4px 0 0 4px" }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendChat(orderId)
                  }
                />

                <div
                  style={{
                    width: 150,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 10px",
                    backgroundColor: "#5c429e",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faImage}
                    color="white"
                    style={{ cursor: "pointer", fontSize: 18 }}
                    onClick={triggerImageInput}
                  />
                  <FontAwesomeIcon
                    icon={faPaperclip}
                    color="white"
                    style={{
                      marginLeft: "30px",
                      cursor: "pointer",
                      fontSize: 18,
                    }}
                    onClick={triggerFileInput}
                  />
                  <SendIcon
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      "&:hover": { color: "#9F78FF" },
                      marginLeft: "30px",
                    }}
                    onClick={() => handleSendChat(orderId)}
                    fontSize="medium"
                  />
                </div>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(event) => console.log(event.target.files)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageChat;
