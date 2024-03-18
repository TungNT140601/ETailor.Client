import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import "./login.css";
import LogoImg from "../../../assets/images/4891599.jpg";
import { Box } from "@mui/system";
import { Button } from "@mui/base/Button";
import { Input as BaseInput, inputClasses } from "@mui/base/Input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import UserIcon from "../../../assets/images/user.png";
import PasswordIcon from "../../../assets/images/key.png";
import EmailIcon from "../../../assets/images/gmail.png";
import EmailVerifyIcon from "../../../assets/images/verify-emails.png";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";

const Input = React.forwardRef(function CustomInput(props, ref) {
  const { slots, ...other } = props;
  return (
    <BaseInput
      slots={{
        root: InputRoot,
        input: InputElement,
        ...slots,
      }}
      {...other}
      ref={ref}
    />
  );
});

Input.propTypes = {
  slots: PropTypes.shape({
    input: PropTypes.elementType,
    root: PropTypes.elementType,
    textarea: PropTypes.elementType,
  }),
};
export default function Login({ openModal, closeModal }) {
  // ----------------------------------------------- HANDLE VERIFY EMAIL ---------------------------------------------------
  const inputRefs = useRef([]);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [verified, setVerified] = useState("");

  const [error, setError] = useState({
    email_err: "",
    otp_err: "",
    regis_username_err: "",
    regis_password_err: "",
  });

  const handleErrorChange = (prop) => (event) => {
    setError({ ...values, [prop]: event.target.value });
  };

  const handleInputOTP = (index, event) => {
    const { value } = event.target;
    const updatedOtpValues = [...otpValues];
    updatedOtpValues[index] = value;
    setOtpValues(updatedOtpValues);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    setError({ ...error, otp_err: "" });
  };

  const checkOTPEmail = async () => {
    console.log("OTP:", otpValues);
    setLoading(true);
    const CHECK_OTP_URL = `https://e-tailorapi.azurewebsites.net/api/auth/customer/verify-otp`;
    try {
      const response = await fetch(CHECK_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": " application/json",
        },

        body: JSON.stringify({
          phoneOrEmail: values.regis_email,
          otp: otpValues.join(""),
        }),
      });

      if (response.ok) {
        console.log(response);
        setLoading(false);
        setOpenVerify("VERIFIED");
      } else {
        const errorText = await response.text();
        setVerified("INCORRECT_OTP");
        setError({ ...error, otp_err: errorText });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoadingSendMail(true);
    const VERIFY_MAIL_URL = `https://e-tailorapi.azurewebsites.net/api/auth/customer/verify-email?email=${values.regis_email}`;
    try {
      const response = await fetch(VERIFY_MAIL_URL, {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      });
      if (response.ok) {
        setOpenVerify("OPEN");
        setLoadingSendMail(false);
      } else {
        const errorText = await response.text();
        setError(() => ({ ...error, email_err: errorText }));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------- HANDLE LOGIN ---------------------------------------------------
  const [values, setValues] = React.useState({
    login_email: "",
    login_password: "",
    regis_username: "",
    regis_email: "",
    regis_password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingSendMail, setLoadingSendMail] = useState(false);
  const [openVerify, setOpenVerify] = useState("");
  console.log("openVerify:", openVerify);
  const handleLoginBtn = async (event) => {
    setLoading(true);
    console.log({
      email: values.login_email,
      password: values.login_password,
    });
    const LOGIN_URL = `https://e-tailorapi.azurewebsites.net/api/auth/customer/login`;
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername: values.login_email,
          password: values.login_password,
          clientToken: "",
        }),
      });
      if (response.ok) {
        setLoading(false);

        const data = await response.json();
        console.log(response);
        closeModal();
        localStorage.setItem("customer", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const [loginOrReg, setLoginOrReg] = useState("LOGIN");
  const handleRegisterClick = () => {
    setLoginOrReg("REGISTER");
  };
  const handleLoginClick = () => {
    setLoginOrReg("LOGIN");
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (prop === "regis_email") {
      setError(() => ({ ...error, email_err: "" }));
      setLoadingSendMail(false);
      setOpenVerify("");
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // ----------------------------------------------- HANDLE REGISTER ---------------------------------------------------

  const handleRegister = async (event) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Email", values.regis_email);
    formData.append("Username", values.regis_username);
    formData.append("Password", values.regis_password);

    const LOGIN_URL = `https://e-tailorapi.azurewebsites.net/api/customer-management/regis`;
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        body: formData,
      });
      console.log("hi", JSON.stringify(response));
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        console.log(response);
        closeModal();
        localStorage.setItem("customer", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={openModal}>
          {loginOrReg === "LOGIN" ? (
            <ModalContent sx={style}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  height: "100%",
                  padding: "40px 0px",
                }}
              >
                <div className="login-form" style={{ width: "50%" }}>
                  <h1 className="title is-2">Đăng nhập</h1>
                  <div className="input-form">
                    <Input
                      id="outlined-start-adornment"
                      name="email"
                      autoFocus
                      startAdornment={
                        <InputAdornment>
                          <img width={24} height={24} src={UserIcon}></img>
                        </InputAdornment>
                      }
                      value={values.email}
                      placeholder="Tên người dùng hoặc email"
                      onChange={handleChange("login_email")}
                    />
                  </div>
                  <div className="input-form">
                    <Input
                      id="outlined-adornment-password"
                      placeholder="Mật khẩu"
                      type={values.showPassword ? "text" : "password"}
                      value={values.login_password}
                      name="password"
                      onChange={handleChange("login_password")}
                      startAdornment={
                        <InputAdornment>
                          <img width={24} height={24} src={PasswordIcon}></img>
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment>
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </div>
                  <div className="remember-user" style={{ paddingTop: "10px" }}>
                    <label className="checkbox">
                      <input type="checkbox"></input> Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <div
                    className="field loginbtn-submit"
                    style={{ paddingTop: "20px" }}
                  >
                    <p className="control">
                      <button
                        className="button"
                        onClick={handleLoginBtn}
                        style={{
                          backgroundColor: "#26282E",
                          color: "#FFFFFF",
                          width: "90%",
                          fontSize: "1rem",
                          borderRadius: "5px",
                        }}
                      >
                        Đăng nhập &nbsp;{" "}
                        {loading && (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#FFFFFF" }}
                          />
                        )}
                      </button>
                    </p>
                  </div>
                  <div className="field" style={{ paddingLeft: 10 }}>
                    <p className="control">
                      Chưa có tài khoản{" "}
                      <a href="#" onClick={handleRegisterClick}>
                        Đăng ký ngay
                      </a>
                    </p>
                    <p className="control" style={{ paddingTop: "10px" }}>
                      <a href="#">Quên mật khẩu</a>
                    </p>
                  </div>
                </div>
                <div>
                  <img src={LogoImg} width={500} height={500}></img>
                </div>
              </div>
            </ModalContent>
          ) : (
            <ModalContent sx={style}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <div className="login-form" style={{ width: "50%" }}>
                  <h1 className="title is-2" style={{ marginBottom: "10px" }}>
                    Đăng ký tài khoản
                  </h1>
                  <div className="input-form">
                    <Input
                      id="outlined-start-adornment"
                      placeholder="Tên người dùng"
                      autoFocus
                      startAdornment={
                        <InputAdornment>
                          <img width={24} height={24} src={UserIcon}></img>
                        </InputAdornment>
                      }
                      value={values.regis_username}
                      onChange={handleChange("regis_username")}
                    />
                  </div>
                  <div className="input-form">
                    <Input
                      id="outlined-adornment-password"
                      startAdornment={
                        <InputAdornment>
                          <img width={24} height={24} src={PasswordIcon}></img>
                        </InputAdornment>
                      }
                      placeholder="Mật khẩu"
                      type={values.showPassword ? "text" : "password"}
                      value={values.regis_password}
                      onChange={handleChange("regis_password")}
                      endAdornment={
                        <InputAdornment>
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </div>
                  <div className="input-form">
                    <Input
                      id="outlined-adornment-password"
                      placeholder="Email"
                      startAdornment={
                        <InputAdornment>
                          <img width={24} height={24} src={EmailIcon}></img>
                        </InputAdornment>
                      }
                      value={values.regis_email}
                      onChange={handleChange("regis_email")}
                      type="email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      endAdornment={
                        <>
                          {values.regis_email.length > 0 && (
                            <InputAdornment>
                              {loadingSendMail ? (
                                <CircularProgress
                                  size={20}
                                  sx={{ color: "rgb(94, 119, 194)" }}
                                />
                              ) : (
                                <>
                                  {openVerify === "VERIFIED" ? (
                                    <img src={EmailVerifyIcon}></img>
                                  ) : (
                                    <span
                                      className="email-verify-btn"
                                      onClick={handleVerifyEmail}
                                    >
                                      Gửi mã
                                    </span>
                                  )}
                                </>
                              )}
                            </InputAdornment>
                          )}
                        </>
                      }
                    />
                    {error.email_err.length > 0 && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          paddingLeft: "5px",
                        }}
                      >
                        {error.email_err}
                      </span>
                    )}
                    {openVerify === "OPEN" && (
                      <>
                        <Typography
                          id="transition-modal-description"
                          sx={{ mt: 1 }}
                        >
                          Mã xác nhận đã được gửi đến email của bạn.
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            mt: 1,
                          }}
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <TextField
                              key={index}
                              inputRef={(ref) =>
                                (inputRefs.current[index] = ref)
                              }
                              variant="outlined"
                              onChange={(event) => handleInputOTP(index, event)}
                              inputProps={{
                                maxLength: 1,
                                style: { textAlign: "center" },
                              }}
                            />
                          ))}
                        </Box>
                        <Box
                          sx={{
                            pt: 2,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {loading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "rgb(94, 119, 194)" }}
                            />
                          ) : (
                            <>
                              {error.otp_err.length > 0 ? (
                                <div style={{ display: "flex" }}>
                                  <span className="text-error">
                                    {error.otp_err}
                                  </span>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "rgb(94, 119, 194)",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    Gửi lại
                                  </p>
                                </div>
                              ) : (
                                <span
                                  className="button email-verify-btn"
                                  onClick={checkOTPEmail}
                                >
                                  Xác nhận
                                </span>
                              )}
                            </>
                          )}
                        </Box>
                      </>
                    )}
                  </div>
                  <div
                    className="field loginbtn-submit"
                    style={{ paddingTop: "10px" }}
                  >
                    <p className="control">
                      <button
                        className="button"
                        onClick={handleRegister}
                        style={{
                          backgroundColor: "#26282E",
                          color: "#FFFFFF",
                          width: "90%",
                          fontSize: "1rem",
                          borderRadius: "5px",
                        }}
                      >
                        Đăng ký&nbsp;&nbsp;{" "}
                        {loading && (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#FFFFFF" }}
                          />
                        )}
                      </button>
                    </p>
                  </div>
                  <div className="field" style={{ paddingLeft: 10 }}>
                    <p className="control">
                      Đã có tài khoản{" "}
                      <a href="#" onClick={handleLoginClick}>
                        Đăng nhập ngay
                      </a>
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={LogoImg} width={500} height={500}></img>
                </div>
              </div>
            </ModalContent>
          )}
        </Fade>
      </Modal>
    </div>
  );
}

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

Backdrop.propTypes = {
  open: PropTypes.bool,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 130000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 600,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const InputRoot = styled("div")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[500]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };
    display: flex;
    align-items: center;
    justify-content: center;
   
  
  
    &.${inputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const InputElement = styled("input")(
  ({ theme }) => `
    font-size: 1rem;
    font-family: inherit;
    font-weight: 500;
    line-height: 2;
    flex-grow: 1;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `
);

const IconButton = styled(Button)(
  ({ theme }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: inherit;
    cursor: pointer;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[700]};
    `
);

const InputAdornment = styled("div")`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
