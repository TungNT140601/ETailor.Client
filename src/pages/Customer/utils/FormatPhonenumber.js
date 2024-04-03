import React from 'react'

export default function FormatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return  match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return null;

}
