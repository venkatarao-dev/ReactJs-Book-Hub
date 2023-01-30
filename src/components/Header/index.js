import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillCloseCircle} from 'react-icons/ai'

import {GiHamburgerMenu} from 'react-icons/gi'
import {HiSun, HiMoon} from 'react-icons/hi'
import NavItem from '../NavItem'
import BookHubContext from '../../context/BookHubContext'
import './index.css'

const navItems = [
  {
    id: 1,
    displayText: 'Home',
    pathText: '',
  },
  {
    id: 2,
    displayText: 'Bookshelves',
    pathText: 'shelf',
  },
  {
    id: 3,
    displayText: 'Favorites',
    pathText: 'favorites',
  },
]

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  renderMobileNavIconsContainer = () => (
    <BookHubContext.Consumer>
      {value => {
        const {updateActiveNavId, onClose, isDarkTheme, onToggleTheme} = value

        const darkThemeCloseColor = isDarkTheme ? '#ffffff' : '#000000'
        const darkThemeMobileNav = isDarkTheme
          ? 'dark-mobile-theme-nav-menu'
          : ''

        const navIcon = isDarkTheme ? (
          <HiSun size={25} color="#ffffff" />
        ) : (
          <HiMoon size={25} color="#64748b" />
        )

        const onChangeTheme = () => {
          onToggleTheme()
        }
        return (
          <div className={`nav-menu-mobile ${darkThemeMobileNav}`}>
            <ul className="nav-menu-list-mobile">
              {navItems.map(eachItem => (
                <NavItem
                  key={eachItem.id}
                  navItemDetails={eachItem}
                  updateActiveNavId={updateActiveNavId}
                />
              ))}
              <button
                type="button"
                className="logout-btn"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
              <button
                className="theme-button"
                type="button"
                onClick={onChangeTheme}
              >
                {navIcon}
              </button>
              <button className="close-button" type="button" onClick={onClose}>
                <AiFillCloseCircle size={25} color={darkThemeCloseColor} />
              </button>
            </ul>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  renderDesktopNavMenu = () => (
    <BookHubContext.Consumer>
      {value => {
        const {updateActiveNavId, isDarkTheme, onToggleTheme} = value
        const onClickWebsiteLogo = () => updateActiveNavId(navItems[0].id)

        const navIcon = isDarkTheme ? (
          <HiSun size={25} color="#ffffff" />
        ) : (
          <HiMoon size={25} color="#64748b" />
        )

        const onChangeTheme = () => {
          onToggleTheme()
        }

        return (
          <div className="nav-bar-large-container">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674816570/Group_7731_wdhmnb.png"
                alt="website logo"
                className="website-logo"
                onClick={onClickWebsiteLogo}
              />
            </Link>
            <ul className="nav-menu">
              {navItems.map(eachItem => (
                <NavItem
                  key={eachItem.id}
                  navItemDetails={eachItem}
                  updateActiveNavId={updateActiveNavId}
                />
              ))}
            </ul>
            <button
              type="button"
              className="logout-btn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
            <button
              className="theme-button"
              type="button"
              onClick={onChangeTheme}
            >
              {navIcon}
            </button>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  render() {
    return (
      <BookHubContext.Consumer>
        {value => {
          const {
            showNavIcons,
            updateActiveNavId,
            onToggleIcon,
            isDarkTheme,
          } = value
          const onClickWebsiteLogo = () => updateActiveNavId(navItems[0].id)

          const headerDarkThemeBg = isDarkTheme ? 'header-dark-theme-bg' : ''
          const hamburgerThemeDark = isDarkTheme ? '#ffffff' : '#000000'

          return (
            <div className={`nav-header ${headerDarkThemeBg}`}>
              <div className="nav-content">
                <div className="navbar-mobile-logo-container">
                  <Link to="/">
                    <img
                      src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674816570/Group_7731_wdhmnb.png"
                      alt="website logo"
                      className="website-logo"
                      onClick={onClickWebsiteLogo}
                    />
                  </Link>
                  <button
                    className="nav-mobile-button"
                    type="button"
                    onClick={onToggleIcon}
                  >
                    <GiHamburgerMenu color={hamburgerThemeDark} size={25} />
                  </button>
                </div>
                {this.renderDesktopNavMenu()}
              </div>
              {showNavIcons && this.renderMobileNavIconsContainer()}
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }
}

export default withRouter(Header)
