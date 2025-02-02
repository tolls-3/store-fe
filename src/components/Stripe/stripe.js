import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { Collapse } from 'antd'
import * as creators from '../../state/actionCreators'
import useCurrency from '../hooks/useCurrency'

import MyStoreCheckout from './MyStoreCheckout'

const { Panel } = Collapse

const Stripe = props => {
  const { cartId } = props
  const [savedCar, setSavedCar] = useState('')
  const [clientId, setClientId] = useState('')
  const [stripeId, setStripeId] = useState('')
  //const savedCar = useSelector(state => state.savedCart)
  const store = useSelector(state => state.user.user)
  const savedDate = new Date(savedCar.checkoutDate || 0)
  const sign = useCurrency(savedCar.currency)
  const dispatch = useDispatch()

  // dispatch(creators.getStore(cartContents.storeId))
  
  useEffect(() => {
    axios
      .get(`https://devshop-be.herokuapp.com/api/store/cart/${cartId}`)
      .then(res => {
        setSavedCar(res.data)

      })
      .catch(error => {
        console.log(error)
      })
  }, [cartId])
  useEffect(() => {
    dispatch(creators.getCart(cartId))
  }, [dispatch, cartId])

  useEffect(() => {
    dispatch(creators.getStore(savedCar.storeId))
  }, [dispatch, savedCar])

  const url = `/store/${store &&
    store.storeName &&
    store.storeName
      .toLowerCase()
      .split(' ')
      .join('-')}-${store && store._id}`

  useEffect(() => {
    axios
      .post('https://devshop-be.herokuapp.com/api/payment/charge', {
        amount: savedCar.agreedPrice
          ? savedCar.agreedPrice.toFixed(2)
          : 0,
        storeId: "5eac6621b882d81f60b6f632"
      })
      .then(res => {
    
        setClientId(res.data.paymentIntent.client_secret)
        setStripeId(res.data.stripeId)
      })
      .catch(err => {
        console.log(err)
      })
  }, [stripeId, savedCar])
  return (
    <div className='payments-cover'>
      <div className='checkout'>
        <h4>Check out</h4>
        <div className='order'>
          <p>Order Summary</p>
          <div className='summary'>
            {savedCar.contents &&
              savedCar.contents.length &&
              savedCar.contents.map(item => (
                <div className='units stop' key={item._id}>
                  {item.name} ({item.quantity} unit
                  {item.quantity > 1 ? 's' : ''}) -{' '}
                  <span style={{ color: '#FF6663' }}>
                    {sign}
                    {item.price}
                  </span>
                </div>
              ))}
          </div>
          <div className='summary left'>
            <div className='units'>
              <span style={{ color: '#FF6663' }}>Total:</span>{' '}
              <span>
                {sign}
                {savedCar.total ? savedCar.total.toFixed(2) : 0}
              </span>
            </div>
            <div className='units'>
              <span style={{ color: '#FF6663' }}>Agreed price:</span>{' '}
              <span>
                {sign}
                {savedCar.agreedPrice
                  ? savedCar.agreedPrice.toFixed(2)
                  : 0}
              </span>
            </div>
            {/* <div className='units'><span style={{ color: '#FF6663' }}>Delivery preference:</span> <span>{savedCar.delivery}</span></div> */}
            <div className='units'>
              <span style={{ color: '#FF6663' }}>Payment preference:</span>{' '}
              <span>{savedCar.paymentPreference}</span>
            </div>
            <div className='units'>
              <span style={{ color: '#FF6663' }}>Date saved:</span>{' '}
              <span>{savedDate.toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='lower'>
        <h4>Payment Methods</h4>
        <div className='infotext'>
          Payment is enabled when cart is confirmed
        </div>
        <Collapse accordion>
          {(
            <Panel
              header='Pay with card'
              key='1'
            >
              <StripeProvider
                apiKey='pk_test_6pBqSOnZHQbQqNU4baLuq8xM00RS0NxI6b'
                stripeAccount={stripeId}
              >
                <MyStoreCheckout clientId={clientId} cartId={cartId} />
              </StripeProvider>
            </Panel>
          )}
          <Panel
            header='Pay with USSD'
            key='2'
          >
            <div className='cash-text'>
              Transfer {sign}
              {savedCar.agreedPrice
                ? savedCar.agreedPrice.toFixed(2)
                : 0}{' '}
              to the seller, and once they confirm receipt, you’ll be redirected
              automatically to the order confirmation page. (Note: the speed of
              this process depends on how quickly the seller can confirm
              receipt.)
            </div>
          </Panel>
          <Panel
            header='Pay in person'
            key='3'
          >
            <div className='cash-text'>
              Please note that payment in person depends entirely on the
              seller’s willingness to keep these items in waiting for you. Most
              sellers tend to favor people who are buying items immediately.
            </div>
            <div className='cash-text'>
              Follow these instructions to pay in person:
              <div>1. Click here to copy your cart URL</div>
              <div>
                2. Click the WhatsApp icon below to share your cart URL and
                discuss arrangements for paying in person.
              </div>
            </div>
            <div className='cash-text'>
              This arrangement deals in honor: reneging on this arrangement
              prevents the seller from clearing items they could have sold to
              someone else and makes them lose faith in humanity. You wouldn’t
              want that, would you?
            </div>
          </Panel>
        </Collapse>
        <div className='save'>
          <NavLink to={`/store/${savedCar.storeId}`}>
            <div className='save-btn'>Abort Transaction</div>
          </NavLink>
          {/* <div style={{ backgroundColor: '#FF6663' }} className='save-btn'>
            Complete Transaction
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Stripe
