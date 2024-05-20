// "use client"


import React, { useEffect, useState } from 'react'
import { Form, Button, Input, notification, Modal, Spin } from "antd"
import FormItem from "antd/es/form/FormItem";
import { useFormik } from "formik";
import { object, string } from "yup";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAppStore } from '@/app/_zustand/useAppStore';

import { loginRequest ,deleteToken } from "@/app/_utils/requests"
import { useRouter } from 'next/navigation';
import { LoginValues } from './types';


const initialValues = {
    account: "",
    password: ""
}

const loginSchema= object().shape({
    account: string()
    .required('Account is required')
    .test(
        'is-username-or-email',
        'Must be a valid username or email address',
        value => {
            return string().matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                'Must be a valid email address'
                ).isValidSync(value) ||
                string().matches(
                    /^[a-zA-Z0-9._-]+$/,
                        'Must be a valid username'
                ).isValidSync(value);
        }
    ),
    password: string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters")
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required("Password is required")
})



export default function FormLogin( ) {
    const {login} = useAppStore()
    const router = useRouter()
    const [noti, contextHolder] = notification.useNotification()
    const [openModal, setOpenModal] = useState<boolean>(false)

    
    
    const formik = useFormik({
        initialValues:initialValues,
        onSubmit: async (value: LoginValues)=>{
                // ! Call api here
                setOpenModal(true)
                const data = await loginRequest(value.account, value.password)

                if(data?.error){
                    setOpenModal(false)
                    noti.error({
                        message:data.error.message
                    })
                }else{
                    login(data!.userName,data!.email, data!.role)
                    setOpenModal(false)
                    router.push("/camera-view")
                }        
        },
        validationSchema:loginSchema
    })

    //! Will be remove soon
    useEffect(()=>{
        deleteToken()
    },[])

    return (
                <Form 
                    method='POST'
                    layout="vertical"
                    name="login-form"
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
                        help={formik.touched.account && formik.errors.account ? formik.errors.account : ""}
                        validateStatus={formik.touched.account && formik.errors.account ? "error": undefined}
                        hasFeedback
                        label={<label style={{fontWeight:"bold"}}>Username or Email</label>}
                    >
                        <Input
                            name="account"
                            size="large"
                            value={formik.values.account}
                            onChange={formik.handleChange}
                        />
                    </FormItem>
                    <FormItem
                        hasFeedback
                        help={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
                        validateStatus={formik.touched.password && formik.errors.password ? "error": undefined}
                        label={<label style={{fontWeight:"bold"}}>Password</label>}                
                    >
                        <Input.Password
                            name="password"
                            size="large"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </FormItem>
                    <FormItem >
                        {contextHolder}
                        <Button type="primary" key="submit" htmlType="submit" className="mt-2">
                            Login
                        </Button>
                    </FormItem>
                </Form>
    )
}