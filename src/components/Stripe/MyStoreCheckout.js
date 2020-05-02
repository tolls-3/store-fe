import React from 'react'
import { Elements } from 'react-stripe-elements'

import InjectedCheckoutForm from './CheckoutForm'

const MyStoreCheckout = (props) => {
  return (
    <Elements>
      <InjectedCheckoutForm clientId={props.clientId} cartId={props.cartId} />
    </Elements>
  )
}

export default MyStoreCheckout
