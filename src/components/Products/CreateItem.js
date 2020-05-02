import React, { useEffect } from 'react'
import { Form, Input, Button, message, Spin } from 'antd'
import AxiosAuth from '../Auth/axiosWithAuth'
import history from '../../history'
import { connect, useSelector } from 'react-redux'
import {
  setLoading,
  setErrors,
  clearErrors,
  getCurrentUser
} from '../../state/actionCreators'
import useCurrency from '../hooks/useCurrency'

const productURL = 'https://devshop-be.herokuapp.com/api/store/products'

function CreateItem({ dispatch, form, isLoading }) {

  const { TextArea } = Input


  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  const currencyDescription = useSelector(state => state.user.user.currency)

  const sign = useCurrency(currencyDescription)


  useEffect(() => {
    dispatch(setLoading(false))
  }, [dispatch])

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFieldsAndScroll((err, values) => {
      if (isNaN(+values.price)) {
        return message.error('Enter a valid price')
      }

      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: values.price,

      }
      if (!err) {
        dispatch(setLoading(true))
        AxiosAuth()
          .post(productURL, payload)
          .then(res => {
            message.success('Item Added')
            dispatch(setLoading(false))
            dispatch(clearErrors())
            history.push('/inventory')
          })
          .catch(error => {
            dispatch(setLoading(false))
            dispatch(setErrors(error.response.data))
            message.error(Object.values(error.response.data)[0])
          })
      } else {
        message.error('Enter Required Fields')
      }
    })
  }

  const toStore = e => {
    e.preventDefault()
    history.push('/inventory')
  }

  const { getFieldDecorator } = form

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

  const createItemComponent = (
    <Spin spinning={isLoading}>
      <div className='cover' id='createUpdate'>
        <div id='header'>
          <h2 id='get-started'>
            Upload new
            <br />
            store item
          </h2>
        </div>
        <Form className='inputForm' {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                {
                  message: 'Name'
                },
                {
                  required: true,
                  message: 'Enter a Name'
                }
              ]
            })(<Input placeholder='Name' />)}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('price', {
              rules: [
                {
                  message: 'Enter a price'
                },
                {
                  required: true,
                  message: 'Enter a price'
                }
              ]
            })(<Input placeholder='Price' addonBefore={sign} />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('description', {
              rules: [
                {
                  message: 'Enter a description'
                },
                {
                  required: true,
                  message: 'Enter a description'
                }
              ]
            })(<TextArea placeholder='Description' allowClear />)}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Done
            </Button>
          </Form.Item>
          <div>
            <p onClick={toStore}>Cancel</p>
          </div>
        </Form>
      </div>
    </Spin>
  )

  return createItemComponent
}

const CreateItemForm = Form.create({ name: 'createItem' })(CreateItem)

const mapStateToProps = state => ({
  isLoading: state.user.isLoading,
  errors: state.user.errors
})

export default connect(mapStateToProps, null)(CreateItemForm)
