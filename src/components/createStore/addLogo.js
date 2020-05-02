import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Input, Icon, Button, message, Upload, Spin } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import AxiosAuth from '../Auth/axiosWithAuth'
import * as creators from '../../state/actionCreators'
import history from '../../history'




const createStoreUrl = 'https://devshop-be.herokuapp.com/api/store'

const AddLogo = props => {
  const dispatch = useDispatch()



  const formState = useSelector(state => state.form)
  const userState = useSelector(state => state.user)



  useEffect(() => {
    dispatch(creators.setLoading(false))
  }, [dispatch])

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      const payload = {
        ownerName: formState.name,
        currency: formState.currency,
        storeName: values.store,
        address: values.address
      }
      if (!err) {
        dispatch(creators.setLoading(true))
        AxiosAuth()
          .post(createStoreUrl, payload)
          .then(res => {
            dispatch(creators.setStore(res.data.saved))
            message.success('store created')
            dispatch(creators.setLoading(false))
            dispatch(creators.clearErrors())
            history.push('/dashboard')
          })
          .catch(error => {
            dispatch(creators.setLoading(false))
            dispatch(creators.setErrors(error.response.data))
            message.error(Object.values(error.response.data)[0])
          })
      } else {
        message.error('Enter Required Fields')
      }
    })
  }

  const { getFieldDecorator } = props.form

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  }

  const addLogoForm = (
    <Spin spinning={userState.isLoading}>
      <div className='cover' id='create-store'>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <div id='header'>
            <h2 id='get-started'>
              Give your store
              <br />a name and an address!
            </h2>
          </div>
          <Form.Item>
            {getFieldDecorator('store', {
              rules: [
                {
                  message: 'Enter your store name'
                },
                {
                  required: true,
                  message: 'Enter your store name'
                }
              ]
            })(<Input placeholder="My store's name is..." />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('address', {
              rules: [
                {
                  message: 'Enter your store address'
                },
                {
                  required: true,
                  message: 'Enter your store address'
                }
              ]
            })(<Input placeholder="My store's address is..." />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Done
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  )

  return addLogoForm
}

const AddLogoForm = Form.create({ name: 'register' })(AddLogo)

export default AddLogoForm
