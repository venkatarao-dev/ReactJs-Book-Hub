import './index.css'
import BookHubContext from '../../context/BookHubContext'

const BookShelf = props => {
  const {shelfItemDetails, updateActiveShelf, isActive} = props
  const {label} = shelfItemDetails
  const shelfValue = shelfItemDetails.value

  const activeLabel = isActive ? 'active-shelf' : ''

  const onClickBookShelf = () => {
    updateActiveShelf(shelfValue)
  }

  return (
    <BookHubContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const darkThemeLabel = isDarkTheme ? 'shelf-item-dark' : ''

        return (
          <li className="shelf-item">
            <button
              type="button"
              className={`shelf-item-button ${darkThemeLabel} ${activeLabel}`}
              onClick={onClickBookShelf}
            >
              {label}
            </button>
          </li>
        )
      }}
    </BookHubContext.Consumer>
  )
}
export default BookShelf
