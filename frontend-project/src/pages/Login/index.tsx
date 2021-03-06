import React, { Component } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import './style.css';
import request from '../../request';
import qs from 'qs';

import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';

interface FormFields {
  password: string;
}

interface Props {
  form: WrappedFormUtils<FormFields>;
}

class LoginForm extends Component<Props> {
  state = {
    isLogin: false
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        request
          .post(
            '/api/login',
            qs.stringify({
              password: values.password
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          )
          .then(res => {
            if (res.data) {
              this.setState({
                isLogin: true
              });
            } else {
              message.error('登录失败');
            }
          });
      }
    });
  };

  render() {
    const { isLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return isLogin ? (
      <Redirect to="/" />
    ) : (
      <div className="login-page">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm;
