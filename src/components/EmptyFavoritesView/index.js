import {Link} from 'react-router-dom'
import BookHubContext from '../../context/BookHubContext'
import './index.css'

const EmptyFavoriteView = () => (
  <BookHubContext.Consumer>
    {value => {
      const {isDarkTheme, updateActiveNavId} = value
      const darkThemeEmptyViewHeading = isDarkTheme
        ? 'favorites-empty-heading-dark-theme'
        : null

      const onClickFindBooks = () => {
        updateActiveNavId(2)
      }

      return (
        <div className="favorites-empty-view-container">
          <img
            src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674850856/empty_favourite_image_skrjg1.jpg"
            alt="favorites empty"
            className="favorites-empty-img"
          />
          <h1
            className={`favorites-empty-heading ${darkThemeEmptyViewHeading}`}
          >
            No Favorite Books
          </h1>
          <Link to="/shelf">
            <button
              className="empty-view-find-books-btn"
              type="button"
              onClick={onClickFindBooks}
            >
              Find Books
            </button>
          </Link>
        </div>
      )
    }}
  </BookHubContext.Consumer>
)

export default EmptyFavoriteView
