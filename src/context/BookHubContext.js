import React from 'react'

const BookHubContext = React.createContext({
  activeNavId: '',
  updatedActiveNavId: () => {},
  showNavIcons: false,
  onToggleIcon: () => {},
  onClose: () => {},
  isDarkTheme: false,
  onToggleTheme: () => {},
  favoritesList: [],
  removeAllFavorites: () => {},
  removeFavorites: () => {},
  addFavorites: () => {},
})

export default BookHubContext
