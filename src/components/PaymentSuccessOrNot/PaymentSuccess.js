import React, { useState, useEffect } from "react";
import "./index.css";
import logo from "../../assets/logo.png";

function PaymentSuccess() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="plink-box-succes-payment-container">
        <div className="plink-box-succes-payment-container-content">
          <center>
            <img
              src={logo}
              alt="Etailor-logo"
              style={{ width: 100, height: 100 }}
            />
            <h2 className="is-family-code">THANH TOÁN THÀNH CÔNG</h2>
            <i className="plink-payment-status-icon fas fa-check-circle"></i>
            <br />
            <p
              style={{ marginTop: 25, color: "white", fontWeight: "600" }}
              className="is-family-code"
            >
              Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi.
            </p>
          </center>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
