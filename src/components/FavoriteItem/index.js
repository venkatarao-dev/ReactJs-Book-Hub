import {AiFillCloseCircle} from 'react-icons/ai'

import {Link} from 'react-router-dom'

import './index.css'

import BookHubContext from '../../context/BookHubContext'

const FavoriteItem = props => (
  <BookHubContext.Consumer>
    {value => {
      const {removeFavorites, isDarkTheme} = value
      const {favoriteBookDetails} = props
      const {id, title, authorName, readStatus, coverPic} = favoriteBookDetails

      const onClickRemove = () => {
        removeFavorites(id)
      }
      const darkThemeBg = isDarkTheme ? 'favorite-item-bg-dark-theme' : ''
      const darkThemeDescription = isDarkTheme
        ? 'favorite-item-dark-description'
        : ''

      const darkThemeTitle = isDarkTheme ? 'favorite-item-title' : ''

      const closeIconColor = isDarkTheme ? '#d3d3d3' : '#616e7c'
      return (
        <Link to={`/books/${id}`} className="favorite-book-item-nav-link">
          <li className={`favorite-item-bg ${darkThemeBg}`}>
            <img src={coverPic} alt={title} className="favorite-item-image" />
            <div className="favorite-item-details-container">
              <div className="favorite-item-title-author-container">
                <p className={`favorite-item-title ${darkThemeTitle}`}>
                  {title}
                </p>
                <p className={`favorite-item-author ${darkThemeDescription}`}>
                  by {authorName}
                </p>
              </div>
              <div className="total-price-remove-container">
                <p
                  className={`favorite-book-status-text ${darkThemeDescription}`}
                >
                  status:{' '}
                  <span className="favorite-book-status">{readStatus}</span>
                </p>
                <button
                  type="button"
                  className={`remove-btn ${darkThemeDescription}`}
                  onClick={onClickRemove}
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              className="delete-btn"
              type="button"
              onClick={onClickRemove}
            >
              <AiFillCloseCircle color={`${closeIconColor}`} size={20} />
            </button>
          </li>
        </Link>
      )
    }}
  </BookHubContext.Consumer>
)
export default FavoriteItem
