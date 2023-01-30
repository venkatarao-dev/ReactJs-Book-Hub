import {Link} from 'react-router-dom'
import Header from '../Header'
import TopRatedBooks from '../TopRatedBooks'
import BookHubContext from '../../context/BookHubContext'
import './index.css'

const Home = () => (
  <BookHubContext.Consumer>
    {value => {
      const {isDarkTheme, updateActiveNavId} = value
      const onClickFindButton = () => {
        updateActiveNavId(2)
      }

      const homeDarkThemeHeading = isDarkTheme ? 'home-heading-dark-theme' : ''
      const homeDescriptionDarkTheme = isDarkTheme
        ? 'home-description-dark-theme'
        : ''
      const darkHomeBg = isDarkTheme ? 'home-container-dark' : null
      return (
        <>
          <Header />
          <div className={`home-container ${darkHomeBg}`}>
            <div className="home-content">
              <h1 className={`home-heading ${homeDarkThemeHeading}`}>
                Find Your Next Favorite Books?
              </h1>
              <p className={`home-description ${homeDescriptionDarkTheme}`}>
                You are in the right place. Tell us what titles or genres you
                have enjoyed in the past, and we will give you surprisingly
                insightful recommendations.
              </p>
              <Link to="/shelf">
                <button
                  className="find-books-mobile-button"
                  type="button"
                  onClick={onClickFindButton}
                >
                  Find Books
                </button>
              </Link>
            </div>
            <TopRatedBooks />
          </div>
        </>
      )
    }}
  </BookHubContext.Consumer>
)

export default Home
