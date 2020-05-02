import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button } from 'antd'
import { NavLink } from 'react-router-dom'
import * as creators from '../../state/actionCreators'
import useCurrency from '../hooks/useCurrency'

const { Meta } = Card

const StoreMain = props => {
  const { sellerId, cartContents, store } = props

  const dispatch = useDispatch()
  useEffect(() => {
    creators.setLoading(true)
    dispatch(creators.getProducts(sellerId))
    dispatch(creators.getStore(sellerId))
    dispatch(creators.setStoreUrl(window.location.href))
    creators.setLoading(false)
  }, [sellerId, dispatch])
  const inventory = useSelector(state => state.store)
  const storeDetails = store.user
  const searchString = useSelector(state => state.search)
  const currency = useCurrency(storeDetails.currency)


  function searchObj(obj, string) {
    const regExpFlags = 'gi'
    const regExp = new RegExp(string, regExpFlags)
    return JSON.stringify(obj).match(regExp)
  }
  const removeItem = item => {
    dispatch(creators.subtractFromCart(item))
  }
  const searchFilter = inventory.filter(function (obj) {
    return searchObj(obj, searchString)
  })
  const dispatchItem = item => {
    dispatch(creators.addToCart(item))
  }
  return (
    <div>

      <div>
        <h2>{storeDetails.storeName}</h2>
      </div>
      <LargeItems
        inventory={searchString ? searchFilter : inventory}
        currency={currency}
        dispatchItem={dispatchItem}
        cartContents={cartContents}
        removeItem={removeItem}
      />

    </div>
  )
}

const LargeItems = ({
  inventory,
  currency,
  dispatchItem,
  cartContents,
  removeItem
}) => {
  const btnChange = item => {
    const itemObj = cartContents.find(({ productId }) => productId === item._id)
    return itemObj
  }
  return inventory.map(item => (
      <Card
        key={item.name}
        bordered='false'
        className='cards'
        hoverable
      >
        <Meta
          title={
            <div className='label'>
              <NavLink to={`/product/${item._id}`}>
                <h3 className='desc'>{item.name}</h3>
                <div className='price'>
                  {currency}
                  {item.price}
                </div>
              </NavLink>
              <div className='add'>
                {!btnChange(item) ? (
                  <Button
                    onClick={() => dispatchItem(item)}
                    style={{ color: '#FF5A5A' }}
                    type='link'
                    size='large'
                  >
                    Add to Cart
                  </Button>
                ) : (
                    <Button
                      onClick={() => removeItem(item)}
                      style={{ color: 'dodgerblue' }}
                      type='link'
                      size='large'
                    >
                      Remove from Cart
                    </Button>
                  )}
              </div>
            </div>
          }
        />
      </Card>
  ))
}

export default StoreMain
