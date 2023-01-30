import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import {AiFillHeart} from 'react-icons/ai'
import './index.css'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import BookHubContext from '../../context/BookHubContext'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {
    bookData: {},
    apiStatus: apiStatusConstant.initial,
    isFavoriteBook: false,
  }

  componentDidMount() {
    this.getBookData()
  }

  getFormattedData = data => ({
    id: data.id,
    authorName: data.author_name,
    coverPic: data.cover_pic,
    aboutAuthor: data.about_author,
    aboutBook: data.about_book,
    rating: data.rating,
    readStatus: data.read_status,
    title: data.title,
  })

  getBookData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(bookApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.book_details)
      console.log(updatedData)

      this.setState({
        bookData: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderSuccessView = () => {
    const {bookData, isFavoriteBook} = this.state
    const {
      authorName,
      aboutBook,
      title,
      rating,
      id,
      aboutAuthor,
      readStatus,
      coverPic,
    } = bookData
    return (
      <BookHubContext.Consumer>
        {value => {
          const {
            isDarkTheme,
            removeFavorites,
            addFavorites,
            favoritesList,
          } = value
          const bookDetailsDarkBg = isDarkTheme
            ? 'book-item-details-dark-bg'
            : ''
          const darkThemeHeading = isDarkTheme
            ? 'book-details-heading-dark'
            : ''
          const darkThemeDescription = isDarkTheme
            ? 'book-details-description-dark'
            : ''
          const darkColor = isDarkTheme ? '#d3d3d3' : '#475569'
          const bookObject = favoritesList.find(eachBook => eachBook.id === id)
          const isFavorite = bookObject !== undefined

          const favoriteIcon = isFavorite ? (
            <AiFillHeart size={25} color="#ff0b37" />
          ) : (
            <AiFillHeart size={25} color={`${darkColor}`} />
          )

          const onClickFavoriteIcon = () => {
            // eslint-disable-next-line no-unused-expressions
            isFavoriteBook
              ? removeFavorites(id)
              : addFavorites({...bookData, isFavorite: true})
            this.setState(prevState => ({
              isFavoriteBook: !prevState.isFavoriteBook,
            }))
          }

          return (
            <div className={`details-container ${bookDetailsDarkBg}`}>
              <div className="cover-pic-and-info-container">
                <img
                  src={coverPic}
                  alt={title}
                  className="book-details-cover-pic"
                />

                <div className="info-container">
                  <h1 className={`book-details-title ${darkThemeHeading}`}>
                    {title}
                  </h1>

                  <p className={`book-details-author ${darkThemeDescription}`}>
                    {authorName}
                  </p>
                  <div className="rating-container">
                    <p
                      className={`book-details-rating-text ${darkThemeDescription}`}
                    >
                      Avg Rating
                    </p>
                    <BsFillStarFill color="#fbbf24" size={18} />
                    <p
                      className={`book-details-rating ${darkThemeDescription}`}
                    >
                      {rating}
                    </p>
                  </div>
                  <p
                    className={`book-details-status-text ${darkThemeDescription}`}
                  >
                    Status:
                    <span className="book-details-status">{readStatus}</span>
                  </p>
                  <button
                    type="button"
                    className={`add-favorites-btn ${darkThemeDescription}`}
                    onClick={onClickFavoriteIcon}
                  >
                    Add to Favorites {favoriteIcon}
                  </button>
                </div>
              </div>
              <hr className="horizontal-line" />
              <h1 className={`about-author-heading ${darkThemeHeading}`}>
                About Author
              </h1>
              <p className={`about-author-description ${darkThemeDescription}`}>
                {aboutAuthor}
              </p>
              <h1 className={`about-book-heading ${darkThemeHeading}`}>
                About Book
              </h1>
              <p className={`about-book-description ${darkThemeDescription}`}>
                {aboutBook}
              </p>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  onClickTryAgain = () => {
    this.getBookData()
  }

  renderFailureView = () => (
    <BookHubContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const darkThemeDescription = isDarkTheme
          ? 'book-item-dark-description'
          : ''
        return (
          <div className="book-details-failure-view">
            <img
              src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674833099/Group_7522_nby7ef.png"
              alt="failure view"
              className="book-details-failure-img"
            />
            <p className={`book-details-failure-text ${darkThemeDescription}`}>
              Something went wrong, Please try again.
            </p>
            <button
              type="button"
              className="book-details-try-again-btn"
              onClick={this.onClickTryAgain}
            >
              Try Again
            </button>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  renderLoadingView = () => (
    <div className="book-details-loader-container" testid="loader">
      <Loader type="TailSpin" color="#0248c7" height={50} width={50} />
    </div>
  )

  renderBookDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="book-details-container">{this.renderBookDetails()}</div>
        {apiStatus === apiStatusConstant.success && <Footer />}
      </>
    )
  }
}

export default BookItemDetails
