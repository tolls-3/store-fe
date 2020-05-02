import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message, Spin } from 'antd'
import AxiosAuth from '../Auth/axiosWithAuth'
import history from '../../history'
import { setLoading, setErrors, clearErrors } from '../../state/actionCreators'
import * as creators from '../../state/actionCreators'
import useCurrency from '../hooks/useCurrency'

function UpdateItem(props) {
  const [item, setItem] = useState([])
  const { TextArea } = Input
  const itemId = props.match.params.id
  const productURL = `https://devshop-be.herokuapp.com/api/store/products/${itemId}`

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(creators.getCurrentUser())
  }, [dispatch])

  const currencyDescription = useSelector(state => state.user.user.currency)

  const sign = useCurrency(currencyDescription)

  useEffect(() => {
    AxiosAuth()
      .get(
        `https://devshop-be.herokuapp.com/api/store/products/${itemId}`
      )
      .then(res => {
        setItem(res.data)
        props.dispatch(setLoading(false))
      })
  }, [itemId, props])



  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price
      }
      if (!err) {
        props.dispatch(setLoading(true))
        AxiosAuth()
          .put(productURL, payload)
          .then(res => {
            message.success('item updated')
            props.dispatch(setLoading(false))
            props.dispatch(clearErrors())
            history.push('/inventory')
          })
          .catch(error => {
            props.dispatch(setLoading(false))
            props.dispatch(setErrors(error.response.data))
            message.error(Object.values(error.response.data)[0])
          })
      } else {
        message.error('Validation failed')
      }
    })
  }

  const toStore = e => {
    e.preventDefault()
    history.push('/inventory')
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

  return (
    <Spin spinning={props.isLoading}>
      <div className='cover' id='createUpdate'>
        <div id='header'>
          <h2 id='get-started'>Update {item.name}</h2>
        </div>
        <Form className='inputForm' {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('name', {
              initialValue: item.name,
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
              initialValue: item.price
            })(<Input placeholder='Price' addonBefore={sign} />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('description', {
              initialValue: item.description,
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
}
const UpdateItemForm = Form.create()(UpdateItem)
const mapStateToProps = state => ({
  isLoading: state.user.isLoading,
  errors: state.user.errors
})

export default connect(mapStateToProps, null)(UpdateItemForm)
