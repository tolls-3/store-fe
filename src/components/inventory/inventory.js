import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Input, Tabs, Button, Modal, message, Card } from 'antd'
import { NavLink } from 'react-router-dom'
import AxiosAuth from '../Auth/axiosWithAuth'
import * as creators from '../../state/actionCreators'
import history from '../../history'

import useCurrency from '../hooks/useCurrency'

const { TabPane } = Tabs
const { Search } = Input

const Inventory = () => {
  const [searchString, setSearchString] = useState('')
  const change = e => {
    setSearchString(e.target.value)
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(creators.getCurrentUser())
  }, [dispatch])

  const inventory = useSelector(state => state.store)
  const storeDetails = useSelector(state => state.user)

  function searchObj(obj, string) {
    const regExpFlags = 'gi'
    const regExp = new RegExp(string, regExpFlags)
    return JSON.stringify(obj).match(regExp)
  }

  const searchFilter = inventory.filter(function (obj) {
    return searchObj(obj, searchString)
  })

  const sign = useCurrency(storeDetails.user.currency)
  const { confirm } = Modal

  function deleteConfirm(id) {
    confirm({
      title: 'Are you sure you want to delete this item?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        AxiosAuth()
          .delete(
            `https://devshop-be.herokuapp.com/api/store/products/${id}`
          )
          .then(res => {
            dispatch(creators.getCurrentUser())
            message.success('Item Deleted')
            history.go(0)
          })
          .catch(error => {
            message.error(Object.values(error.response.data)[0])
          })
      },
      onCancel() { }
    })
  }


  return (
    <div className='cover inventory'>
      <div className='top'>
        <div className='search'>
          <Search
            onChange={change}
            placeholder='search'
            style={{ width: 200 }}
          />
        </div>
        <div className='content' style={{ paddingTop: '10px' }}>
          <div>
            <h2 style={{ color: 'darkgrey', paddingBottom: '15px' }}>{storeDetails.user.storeName ? storeDetails.user.storeName : 'Your Store'}</h2>
          </div>
          <div>
            <Tabs className='tabs' defaultActiveKey='1'>
              <TabPane tab='Collapse' key='1'>
                <Items inventory={searchString ? searchFilter : inventory} currency={sign} delet={deleteConfirm} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

const Items = ({ inventory, currency, delet }) => {
  return (
    <List
      size='small'
      itemLayout='horizontal'
      dataSource={inventory}
      locale={{ emptyText: 'Click the plus button below to start adding items to your store' }}
      renderItem={item => {
        return (
          <List.Item className='block'>
            <List.Item.Meta
              title={
                <div className='list title short' >
                  <h3>{item.name}</h3>
                  <div>{currency}{item.price}</div>
                  <NavLink to={`/updateitem/${item._id}`}>
                    <div className='delete'>
                      <Button>Edit</Button>
                    </div>
                  </NavLink>
                </div>
              }
              description={
                <div className='list title short'>
                  <div className='item-description'>{item.description}</div>
                  <div className='delete' onClick={e => delet(item._id)}>
                    <Button>Delete </Button>
                  </div>
                </div>
              }
            />

          </List.Item>
        )
      }}
    />
  )
}

export default Inventory
