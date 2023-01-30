import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Footer from '../Footer'

import './index.css'

import BookHubContext from '../../context/BookHubContext'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  speed: 500,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class TopRatedBooks extends Component {
  state = {topRatedBooksList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getTopRatedBooksList()
  }

  getFormattedData = data => ({
    id: data.id,
    authorName: data.author_name,
    coverPic: data.cover_pic,
    title: data.title,
  })

  getTopRatedBooksList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const topRatedApiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(topRatedApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(eachBook =>
        this.getFormattedData(eachBook),
      )
      this.setState({
        topRatedBooksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTopRatedBooksSlidesView = () => {
    const {topRatedBooksList} = this.state
    return (
      <BookHubContext.Consumer>
        {value => {
          const {updateActiveNavId, isDarkTheme} = value

          const onClickBook = () => {
            updateActiveNavId('')
          }
          const darkThemeBookTitle = isDarkTheme
            ? 'book-title-dark-theme'
            : null
          const darkThemeBookAuthor = isDarkTheme
            ? 'book-author-dark-theme'
            : null

          return (
            <div className="slick-container">
              <Slider {...settings}>
                {topRatedBooksList.map(eachBook => {
                  const {id, title, authorName, coverPic} = eachBook
                  return (
                    <Link
                      to={`/books/${id}`}
                      className="slider-nav-link"
                      key={id}
                      onClick={onClickBook}
                    >
                      <div className="slick-item" key={id}>
                        <img
                          src={coverPic}
                          alt="company logo"
                          className="cover-pic"
                        />
                        <h1 className={`book-title ${darkThemeBookTitle}`}>
                          {title}
                        </h1>
                        <p className={`book-author ${darkThemeBookAuthor}`}>
                          {authorName}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </Slider>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  renderTopRatedLoaderView = () => (
    <div className="top-rated-loader-container" testid="loader">
      <Loader type="TailSpin" height={50} width={50} color="#0284c7" />
    </div>
  )

  onClickTryAgain = () => {
    this.getTopRatedBooksList()
  }

  renderTopRatedFailureView = () => (
    <BookHubContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const darkThemeFailureText = isDarkTheme
          ? 'top-rated-failure-dark-theme-description'
          : null

        return (
          <div className="top-rated-failure-container">
            <img
              src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674833099/Group_7522_nby7ef.png"
              alt="failure view"
              className="top-rated-failure-image"
            />
            <p
              className={`top-rated-failure-description ${darkThemeFailureText}`}
            >
              Something went wrong. Please try again
            </p>
            <button
              type="button"
              className="try-again-btn"
              onClick={this.onClickTryAgain}
            >
              Try Again
            </button>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  renderTopRatedBooksHeading = () => (
    <BookHubContext.Consumer>
      {value => {
        const {updateActiveNavId, isDarkTheme} = value

        const onClickFindBtn = () => {
          updateActiveNavId(2)
        }
        const topRatedHeadingDarkTheme = isDarkTheme
          ? 'top-rated-heading-dark-theme'
          : null
        return (
          <div className="top-rated-books-header-container">
            <h1 className={`top-rated-heading ${topRatedHeadingDarkTheme}`}>
              Top Rated Books
            </h1>
            <Link to="/shelf" className="slider-nav-link">
              <button
                type="button"
                className="find-books-desktop-btn"
                onClick={onClickFindBtn}
              >
                Find Books
              </button>
            </Link>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  renderTopRatedBooksContainerView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedBooksSlidesView()
      case apiStatusConstants.failure:
        return this.renderTopRatedFailureView()
      case apiStatusConstants.inProgress:
        return this.renderTopRatedLoaderView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <BookHubContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const topRatedContainerDarkTheme = isDarkTheme
            ? 'top-rated-books-container-dark-theme'
            : null
          return (
            <>
              <div
                className={`top-rated-books-container ${topRatedContainerDarkTheme}`}
              >
                {this.renderTopRatedBooksHeading()}
                {this.renderTopRatedBooksContainerView()}
              </div>
              {apiStatus === apiStatusConstants.success && <Footer />}
            </>
          )
        }}
      </BookHubContext.Consumer>
    )
  }
}
export default TopRatedBooks
