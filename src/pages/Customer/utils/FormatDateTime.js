import React from 'react'

export default function FormatDateTime(date) {
    const datetime = new Date(date);
    const day = datetime.getDate();
    const month = datetime.getMonth() + 1;
    const year = datetime.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
