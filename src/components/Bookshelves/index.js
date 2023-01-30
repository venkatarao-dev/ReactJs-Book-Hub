import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import BookShelf from '../BookShelf'
import BookItem from '../BookItem'
import './index.css'

import BookHubContext from '../../context/BookHubContext'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    searchInput: '',
    activeShelf: bookshelvesList[0].value,
    apiStatus: apiStatusConstants.initial,
    booksData: [],
  }

  componentDidMount() {
    this.getBooksData()
  }

  getFormattedData = data => ({
    id: data.id,
    authorName: data.author_name,
    coverPic: data.cover_pic,
    title: data.title,
    rating: data.rating,
    readStatus: data.read_status,
  })

  getBooksData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, activeShelf} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const booksApiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeShelf}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(booksApiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(eachBook =>
        this.getFormattedData(eachBook),
      )

      this.setState({
        booksData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoSearchResultsView = () => {
    const {searchInput} = this.state
    return (
      <BookHubContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const darkThemeDescription = isDarkTheme
            ? 'no-books-dark-description'
            : ''
          return (
            <div className="no-books-view-container">
              <img
                src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674896710/Group_afcgam.png"
                alt="no books"
                className="no-books-view-image"
              />
              <p className={`no-books-description ${darkThemeDescription}`}>
                Your search for {searchInput} did not find any matches.
              </p>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  renderBooks = booksList => (
    <ul className="book-items-details-container">
      {booksList.map(eachBook => (
        <BookItem key={eachBook.id} bookDetails={eachBook} />
      ))}
    </ul>
  )

  renderSuccessView = () => {
    const {booksData} = this.state
    const numberOfBooks = booksData.length
    console.log(numberOfBooks)
    const showBooksView = numberOfBooks === 0
    const halfIndex = Math.floor((numberOfBooks + 1) / 2)
    const leftSideBooksList = booksData.slice(0, halfIndex)
    const rightSideBooksList = booksData.slice(halfIndex)
    return (
      <>
        {showBooksView ? (
          this.renderNoSearchResultsView()
        ) : (
          <>
            <div className="all-books-container">
              <div className="left-side-books-container">
                {this.renderBooks(leftSideBooksList)}
              </div>
              <div className="right-side-books-container">
                {this.renderBooks(rightSideBooksList)}
              </div>
            </div>
            <Footer />
          </>
        )}
      </>
    )
  }

  onClickTryAgainBtn = () => {
    this.getBooksData()
  }

  renderFailureView = () => (
    <BookHubContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const darkThemeDescription = isDarkTheme
          ? 'book_shelves-failure-dark-description'
          : ''
        return (
          <div className="book-shelves-failure-view-container">
            <img
              src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674833099/Group_7522_nby7ef.png"
              alt="failure view"
              className="book-shelves-failure-view-img"
            />
            <p
              className={`bookshelves-failure-description ${darkThemeDescription}`}
            >
              Something went wrong. Please try again.
            </p>
            <button
              type="button"
              className="bookshelves-try-again-btn"
              onClick={this.onClickTryAgainBtn}
            >
              Try Again
            </button>
          </div>
        )
      }}
    </BookHubContext.Consumer>
  )

  renderLoaderView = () => (
    <div className="book-shelves-loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284c7" height={50} width={50} />
    </div>
  )

  renderAllBooksSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterPress = event => {
    if (event.key === 'Enter') {
      this.getBooksData()
    }
  }

  onClickSearchBtn = () => {
    this.getBooksData()
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <BookHubContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const darkThemeSearchContainer = isDarkTheme
            ? 'search-input-container-dark'
            : ''
          const darkThemeSearchInput = isDarkTheme ? 'search-input-dark' : ''
          const darkThemeSearchButton = isDarkTheme ? 'search-button-dark' : ''
          const darkThemeSearchIcon = isDarkTheme ? 'search-icon-dark' : ''
          return (
            <div
              className={`search-input-container ${darkThemeSearchContainer}`}
            >
              <input
                type="search"
                value={searchInput}
                className={`search-input ${darkThemeSearchInput}`}
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterPress}
              />
              <button
                type="button"
                testid="searchButton"
                className={`search-button ${darkThemeSearchButton}`}
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className={`search-icon ${darkThemeSearchIcon}`} />
              </button>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  renderBookShelfHeader = () => {
    const {activeShelf} = this.state
    const {label} = bookshelvesList.find(
      eachShelfItem => eachShelfItem.value === activeShelf,
    )

    return (
      <BookHubContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const darkThemeHeading = isDarkTheme
            ? 'bookshelf-dark-theme-heading'
            : ''

          return (
            <div className="book-shelf-header-container">
              <h1 className={`bookshelf-header-heading ${darkThemeHeading}`}>
                {label} Books
              </h1>
              <div className="desktop-search-input-container">
                {this.renderSearchInput()}
              </div>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  renderHeaderAndBookSection = () => (
    <div className="header-and-books-container">
      {this.renderBookShelfHeader()}
      {this.renderAllBooksSection()}
    </div>
  )

  updateActiveShelf = activeShelf => {
    this.setState({activeShelf}, this.getBooksData)
  }

  renderShelves = () => {
    const {activeShelf} = this.state
    return (
      <BookHubContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const darkThemeHeading = isDarkTheme
            ? 'book-shelves-dark-theme-heading'
            : null

          const darkThemeBg = isDarkTheme ? 'bookshelves-dark-bg' : ''
          return (
            <div className={`shelves-container ${darkThemeBg}`}>
              <div className="mobile-search-input-container">
                {this.renderSearchInput()}
              </div>
              <h1 className={`bookshelves-text ${darkThemeHeading}`}>
                Bookshelves
              </h1>
              <ul className="shelf-items-container">
                {bookshelvesList.map(eachShelfItem => (
                  <BookShelf
                    key={eachShelfItem.id}
                    shelfItemDetails={eachShelfItem}
                    isActive={activeShelf === eachShelfItem.value}
                    updateActiveShelf={this.updateActiveShelf}
                  />
                ))}
              </ul>
            </div>
          )
        }}
      </BookHubContext.Consumer>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="bookshelves-container">
          {this.renderShelves()}
          {this.renderHeaderAndBookSection()}
        </div>
      </>
    )
  }
}

export default Bookshelves
