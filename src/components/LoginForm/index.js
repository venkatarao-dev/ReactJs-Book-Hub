import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    showPassword: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          Username*
        </label>
        <input
          type="text"
          className="username-input-field"
          id="username"
          onChange={this.onChangeUsername}
          value={username}
          placeholder="Username"
        />
      </>
    )
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password, showPassword} = this.state
    const inputType = showPassword ? 'text' : 'password'

    return (
      <>
        <label className="input-label" htmlFor="password">
          Password*
        </label>
        <input
          type={inputType}
          className="password-input-field"
          id="password"
          onChange={this.onChangePassword}
          value={password}
          placeholder="Password"
        />
      </>
    )
  }

  onToggleCheckbox = event => {
    this.setState({showPassword: event.target.checked})
  }

  renderCheckBoxField = () => (
    <div className="checkbox-input-container">
      <input
        type="checkbox"
        className="checkbox-input-field"
        id="checkboxInput"
        onClick={this.onToggleCheckbox}
      />
      <label className="input-label checkbox-label" htmlFor="checkboxInput">
        Show Password
      </label>
    </div>
  )

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <div className="login-desktop-image-container">
          <img
            src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674843116/Rectangle_1467_mwtwas.png"
            className="login-desktop-img"
            alt="website login"
          />
        </div>
        <div className="form-and-mobile-image-container">
          <img
            src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674843180/Ellipse_99_awinxb.png"
            className="login-mobile-image"
            alt="website login"
          />
          <img
            src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674816570/Group_7731_wdhmnb.png"
            alt="login website logo"
            className="login-website-logo"
          />
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <div className="input-container">{this.renderCheckBoxField()}</div>
            {showSubmitError && <p className="error-message">{errorMsg}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
