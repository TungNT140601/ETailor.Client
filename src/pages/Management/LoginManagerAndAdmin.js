import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";

import logo from "../../assets/logo.png";
import image from "../../assets/bg-image.jpg";

const defaultTheme = createTheme();

export default function LoginManagerAndAdmin() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginAdminUrl =
    "https://e-tailorapi.azurewebsites.net/api/auth/staff/login";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      if (data.get("userName") === "") {
        Swal.fire({
          icon: "error",
          title: "Không chính xác",
          text: `Tên đăng nhập không được rỗng!`,
          timer: 4000,
        });
      } else if (data.get("password") === "") {
        Swal.fire({
          icon: "error",
          title: "Không chính xác",
          text: `Mật khẩu không được rỗng!`,
          timer: 4000,
        });
      } else {
        setLoading(true);
        const response = await fetch(loginAdminUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("userName"),
            password: data.get("password"),
          }),
        });
        setLoading(false);
        if (response.status === 200) {
          const data = await response.json();
          if (data.role === "Manager") {
            await localStorage.setItem("manager", JSON.stringify(data));
            await Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Đăng nhập thành công!`,
              timer: 4000,
            });
            navigate("/manager");
          } else if (data.role !== "Manager") {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: `Lỗi đăng nhập`,
              timer: 4000,
            });
          }
        } else if (response.status === 400 || response.status === 500) {
          const dataError = await response.text();
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `${dataError}`,
            timer: 4000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={10} sm={8} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 500,
              margin: "0 auto",
              paddingTop: 15,
            }}
          >
            <figure className="image is-128x128">
              <img className="is-rounded" src={logo} alt="" />
            </figure>
            <Typography component="h1" variant="h5">
              Đăng nhập
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Tên đăng nhập"
                name="userName"
                autoComplete="userName"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#9F78FF",
                    },
                  "& label.Mui-focused": {
                    color: "#9F78FF",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon style={{ cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPass ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#9F78FF",
                    },
                  "& label.Mui-focused": {
                    color: "#9F78FF",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <RemoveRedEyeIcon
                        onClick={showPassword}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <div style={{ textAlign: "center" }}>
                {loading ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#9F78FF",
                      "&:hover": {
                        backgroundColor: "#5c429e",
                      },
                    }}
                  >
                    Đăng nhập &nbsp; &nbsp;
                    <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#9F78FF",
                      "&:hover": {
                        backgroundColor: "#5c429e",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
