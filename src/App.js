import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './components/Home'
import LoginForm from './components/LoginForm'

import Bookshelves from './components/Bookshelves'

import BookItemDetails from './components/BookItemDetails'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import MyFavorites from './components/MyFavorites'
import BookHubContext from './context/BookHubContext'

import './App.css'

class App extends Component {
  state = {
    activeNavId: '',
    favoritesList: [],
    showNavIcons: false,
    isDarkTheme: false,
  }

  updateActiveNavId = navId => {
    this.setState({activeNavId: navId})
  }

  onToggleTheme = () => {
    this.setState(prevState => ({isDarkTheme: !prevState.isDarkTheme}))
  }

  onToggleIcon = () => {
    this.setState(prevState => ({showNavIcons: !prevState.showNavIcons}))
  }

  onClose = () => {
    this.setState({showNavIcons: false})
  }

  removeAllFavorites = () => {
    this.setState({favoritesList: []})
    localStorage.setItem('favorites_list', [])
  }

  addFavorites = book => {
    const {favoritesList} = this.state
    const bookObject = favoritesList.find(eachBook => eachBook.id === book.id)
    if (bookObject === undefined) {
      this.setState(prevState => ({
        favoritesList: [...prevState.favoritesList, book],
      }))
    }
  }

  removeFavorites = id => {
    const {favoritesList} = this.state
    const filteredFavoritesList = favoritesList.filter(
      eachBook => eachBook.id !== id,
    )
    this.setState({favoritesList: filteredFavoritesList})
  }

  render() {
    const {activeNavId, favoritesList, showNavIcons, isDarkTheme} = this.state
    const appTheme = isDarkTheme ? 'dark-theme' : 'light-theme'
    return (
      <BookHubContext.Provider
        value={{
          showNavIcons,
          activeNavId,
          updateActiveNavId: this.updateActiveNavId,
          onToggleIcon: this.onToggleIcon,
          onClose: this.onClose,
          isDarkTheme,
          onToggleTheme: this.onToggleTheme,
          favoritesList,
          removeAllFavorites: this.removeAllFavorites,
          removeFavorites: this.removeFavorites,
          addFavorites: this.addFavorites,
        }}
      >
        <div className={`app-container ${appTheme}`}>
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/shelf" component={Bookshelves} />
            <ProtectedRoute
              exact
              path="/books/:id"
              component={BookItemDetails}
            />
            <ProtectedRoute exact path="/favorites" component={MyFavorites} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </BookHubContext.Provider>
    )
  }
}

export default App
