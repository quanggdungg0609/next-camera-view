import React, { useState } from "react"
import { useFormik } from "formik"

import { object, string } from "yup";
import FormItem from "antd/es/form/FormItem";
import { Form, Button, Input,  Modal, Spin, notification } from "antd"
import { RegisterValues } from "./types";
import {register} from "@/app/_utils/server_function"
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const initialValues: RegisterValues={
    username: "",
    password:"",
    email:""
}

const registerSchema = object().shape({
    username: string().required("Username is required")
        .matches(/^[a-z0-9]+$/, 'Username can only contain      lowercase letters and numbers')
        .min(8,"Username contain at least 8 characters")
        .max(20,"Username contain at most 20 characters"),
    password: string()
    .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters")
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required("Password is required"),
    email: string()
        .email("Email is not valid")
        .required("Email required")
})

interface RegisterFormProps {
    switchToLogin: () => void; 
}

export default function RegisterForm(props: RegisterFormProps){
    const {switchToLogin} = props

    const [noti, contextHolder] = notification.useNotification()
    const [openModal, setOpenModal] = useState<boolean>(false)

    const formik = useFormik({
        initialValues: initialValues, 
        onSubmit: async (value: RegisterValues) =>{
            setOpenModal(true)
            const response = await register(value.username, value.email, value.password)
            if(response?.error){
                // error here
                setOpenModal(false)
                noti.error({
                    message:response.error
                })
            }else{
                setOpenModal(false)
                noti.success({
                    message: response?.message
                })
                setTimeout(()=>{
                    switchToLogin()
                },1000)
                
            }
        }
    });

    return(
        <Form
            method="POST"
            layout="vertical"
            name="register-form"
            onFinish={formik.handleSubmit}
        >
            <Modal
                centered
                maskClosable={false}
                open={openModal}
                footer={null}
                closeIcon={null}
                width="120px"
            >
                <div
                    className='flex 
                                flex-col
                                gap-3
                                w-full justify-center items-center h-[80px]'
                >
                            <Spin></Spin>
                            <p>Loading</p>
                </div>
            </Modal>
            <FormItem
                help={formik.touched.username && formik.errors.username ?   formik.errors.username : ""}
                validateStatus={formik.touched.username && formik.errors.username ? "error":undefined}
                hasFeedback
                label={<label style={{fontWeight:"bold"}}>Username</label>}
            >
                <Input
                    name="username"
                    size="large"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                />
            </FormItem>
            <FormItem
                help={formik.touched.email && formik.errors.email ?   formik.errors.email : ""}
                validateStatus={formik.touched.email && formik.errors.email ? "error":undefined}
                hasFeedback
                label={<label style={{fontWeight:"bold"}}>Email</label>}
            >
                <Input
                    name="email"
                    size="large"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
            </FormItem>
            <FormItem
                help={formik.touched.password && formik.errors.password ?  formik.errors.password : ""}
                validateStatus={formik.touched.password && formik.errors.password ? "error":undefined}
                hasFeedback
                label={<label style={{fontWeight:"bold"}}>Password</label>}
            >
                <Input.Password
                    type="password"
                    name="password"
                    size="large"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                <FormItem >
                        {contextHolder}
                        <Button type="primary" key="submit" htmlType="submit" className="mt-4">
                            Register
                        </Button>
                </FormItem>
            </FormItem>
        </Form>
    )
}