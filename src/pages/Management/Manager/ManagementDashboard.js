import React from 'react'
import { Bar } from 'react-chartjs-2';

export default function ManagementDashboard() {
  const OrderStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  const OverAllStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "20%", gap: 40, margin: 20 }}>
        <div style={{ height: 100, backgroundColor: "#f0f4f5" }}>

        </div>
        <div style={{ height: 100, backgroundColor: "#f0f4f5" }}>

        </div>
        <div style={{ height: 100, backgroundColor: "#f0f4f5" }}>

        </div>
        <div style={{ height: 100, backgroundColor: "#f0f4f5" }}>

        </div>
      </div>
    )
  }
  const StaffTaskStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  const MaterialStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  return (
    <div style={{ width: "100%", height: "99vh", backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #9F78FF", overflowY: "scroll", scrollbarWidth: "none" }}>
      <div style={{ padding: 10 }}>
        <h1 style={{ fontWeight: "bold", fontSize: 24, color: "#9F78FF", paddingTop: 20 }}>Dashboard</h1>
        <div>


        </div>
        <div>
          <OverAllStatistic />
        </div>
        <div>
          <OrderStatistic />
        </div>
        <div>
          <StaffTaskStatistic />
        </div>
        <div>
          <MaterialStatistic />
        </div>
      </div>
    </div>
  )
}
