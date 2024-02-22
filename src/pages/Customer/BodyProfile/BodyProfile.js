import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

export default function BodyProfile() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p className='title is-2'>Hồ sơ số đo</p>
      </div>
      <div style={{ width: "100%", paddingTop: "20px" }}>
        <table class="table" style={{ width: "100%" }}>
          <thead >
            <tr >
              <th style={{color:"#9F78FF"}}>Mã số đo</th>
              <th style={{color:"#9F78FF"}}>Tên số đo</th>
              <th style={{color:"#9F78FF"}}>Người đo</th>
              <th style={{color:"#9F78FF"}}>Ngày đo</th>
              <th style={{color:"#9F78FF"}}>Thao tác</th>
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

    </div>
  )
}
