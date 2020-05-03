import React, { useState, useEffect } from 'react'
import { Card, Button } from 'antd'
import axios from 'axios'
import Nav from '../elements/nav'
import withAuth from '../Auth/axiosWithAuth'
import history from '../../history'
import { connect } from 'react-redux'
import { logout } from '../../state/actionCreators'
const storeURL = 'https://devshop-be.herokuapp.com/api/store'
const stripeURL = 'https://devshop-be.herokuapp.com/api/auth/stripe'

function Account({ dispatch }) {
  const [stripeId, setStripeId] = useState('')
  const [storeId, setStoreId] = useState('')
  useEffect(() => {
    withAuth()
      .get(storeURL)
      .then(res => {
        setStoreId(res.data._id)
        setStripeId(res.data.stripeId)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const connectStripe = e => {
    e.preventDefault()
    axios
      .post(stripeURL, { storeId })
      .then(res => {
        window.location.href = stripeURL
      })
      .catch(err => {
        console.log(err)
      })
  }
  const handleLogout = () => {
    // delete token from local storage and redirect to login
    dispatch(logout())
    history.push('/')
  }

  return (
    <div className='seller-account'>
      <Nav />
      <div className='main'>
        <h2>Account</h2>
        <Card
          className='Card'
          title='Your Stripe ID'
          style={{ fontWeight: '900' }}
        >
          <p id='stripeID'>
            {stripeId || 'Your stripe account is not connected'}
          </p>
        </Card>
        {stripeId ? (
          <Button onClick={connectStripe}>Change Stripe Id</Button>
        ) : (
            <Button onClick={connectStripe}>Connect to Stripe</Button>
          )}
        <Button onClick={handleLogout} htmlType='button'>
          Logout
      </Button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading,
  imageUrl: state.user.user.imageUrl
})

export default connect(mapStateToProps, null)(Account)
