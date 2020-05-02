import React from 'react'
import { Icon, Menu } from 'antd'

import { NavLink } from 'react-router-dom'

function Nav() {
  return (
    <div className='nav'>
      <Menu mode="horizontal">
        <Menu.Item>
          <NavLink to='dashboard' activeClassName='activeLink'><p>Home</p></NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to='inventory' activeClassName='activeLink'><p>Store</p></NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink className='navlink' to='createItem'><Icon className='icon' theme='filled' type='plus-circle' /></NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to='account' activeClassName='activeLink'><p>Account</p></NavLink>
        </Menu.Item>
      </Menu>

    </div>
  )
}

export default Nav




