import {Button, Checkbox, Form, Input, Modal} from "antd";
import {useEffect, useState} from "react";
import request from "../../utils/request";
import styles from './index.module.css'
import {useStore} from "../../store";

type FieldType = {
    identifier?: string;
    credential?: string;
    remember?: string;
};

export default function CheckLogin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const store = useStore()

    const onFinish = (values: any) => {
        if(values.remember) {
            window.localStorage.setItem("loginData", JSON.stringify(values))
        }
        request.post("/api/account/v1/login", values).then(res => {
            if(res.data.code === 0) {
                window.localStorage.setItem('token', res.data.data)
                store.setStore({login: true})
                window.location.reload()
                handleOk()
            }
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const checkLogin = () => {
        const tk = window.localStorage.getItem('token')
        if (!tk) {
            store.setStore({login: false})
            showModal()
            return
        }
        request.get("api/account/v1/detail").then(res => {
            // console.log(res)
            if (res.data.code !== 0) {
                store.setStore({login: false})
                showModal()
            }
        })
    }

    useEffect(() => {
        checkLogin()
    }, []);

    return <Modal title="登录小滴课堂"
                  className={styles.check_login_modal}
                  footer={null}
                  mask
                  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            labelCol={{span: 5}}
            wrapperCol={{span: 16}}
            style={{maxWidth: 600, paddingTop: 30}}
            initialValues={JSON.parse(window.localStorage.getItem('loginData') || "{\"remember\": true}")}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"

        >
            <Form.Item<FieldType>
                label="用户名"
                name="identifier"
                rules={[{required: true, message: '请输入用户名!'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="密码"
                name="credential"
                rules={[{required: true, message: '请输入密码!'}]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{offset: 5, span: 16}}
            >
                <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 5, span: 16}}>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </Form.Item>
        </Form>

    </Modal>
}