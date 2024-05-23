import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import toast from 'react-hot-toast';

function ChangePassword() {
    const onFinish = async (values) => {
        const customer = JSON.parse(localStorage.getItem('customer'));
        console.log('Success:', values);
        const url = 'https://e-tailorapi.azurewebsites.net/api/auth/customer/change-password';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${customer.token}`,
                },
                body: JSON.stringify({
                    oldPassword: values['old-password'],
                    newPassword: values['new-password'],
                }),
            });
            if (response.ok) {
                toast.success('Đổi mật khẩu thành công');

            } else {
                const msg = await response.text();
                toast.error(msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Mật khẩu cũ"
                name="old-password"
                rules={[
                    {
                        required: true,
                        message: 'Nhập mật khẩu cũ!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Mật khẩu mới"
                name="new-password"
                rules={[
                    {
                        required: true,
                        message: 'Nhập mật khẩu mới!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Nhập lại mật khẩu mới"
                name="confirm-password"
                dependencies={['new-password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Nhập lại mật khẩu mới!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('new-password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Thay đổi
                </Button>
            </Form.Item>
        </Form>
    );
}
export default ChangePassword