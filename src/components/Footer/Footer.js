import React from 'react'

export default function Footer() {
    return (
        <div style={{ height: "200px", display: "flex", justifyContent: "center", marginTop: "120px" }}>
            <div style={{ backgroundColor: "#1d2547", width: "70%", color: "#fff", padding: "40px 80px 0 40px" }}>
                <p>This is the footer content.</p>
                <p>You can add links, contact information, or any other relevant information here.</p>
                <p>Footer content © {new Date().getFullYear()}</p>
            </div>
        </div>
    )
}
