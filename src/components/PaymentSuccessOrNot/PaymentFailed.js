import React, { useState, useEffect } from "react";
import "./index.css";
import logo from "../../assets/logo.png";
import { CloseOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

function PaymentFailed() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="plink-box-failed-payment-container">
        <div className="plink-box-failed-payment-container-content">
          <center>
            <img
              src={logo}
              alt="Etailor-logo"
              style={{
                width: 100,
                height: 100,
              }}
            />
            <h2 className="is-family-code">THANH TOÁN KHÔNG THÀNH CÔNG</h2>

            <i
              className="plink-payment-status-failed-icon fa fa-times-circle"
              aria-hidden="true"
            ></i>

            <br />
            <p
              style={{ marginTop: 25, color: "white", fontWeight: "600" }}
              className="is-family-code"
            >
              Xin lỗi vì sản phẩm của chúng tôi không đáp ứng đủ nhu cầu của quý
              khách.
            </p>
          </center>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
