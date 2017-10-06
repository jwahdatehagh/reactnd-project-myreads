import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import BookListing from './BookListing'
import { search } from './BooksAPI'
import { debounce } from 'throttle-debounce'

class BookSearch extends React.Component {

  static propTypes = {
    shelvedBooks: PropTypes.array,
    addBookToShelf: PropTypes.func.isRequired
  }

  state = {
    books: []
  }

  constructor(props) {
    super(props)

    this.onSeachChange = this.onSeachChange.bind(this)

    // debounce the search to prevent rate limiting / too many API requests
    this.searchBooks = debounce(500, this.searchBooks)
  }

  /**
   * Handle changes of the search string.
   */
  onSeachChange(event) {
    this.clearBooks()

    const searchString = event.target.value
    if (searchString) this.searchBooks(searchString)
  }

  /**
   * Perform an API request to search books.
   */
  async searchBooks(searchString) {
    const books = await search(searchString, 6)

    if (books && books.length) {
      this.setState({ books })
    }
  }

  /**
   * If there are books in the state, clear them.
   */
  clearBooks() {
    if (this.state.books.length) this.setState({ books: [] })
  }

  render() {
    const books = this.state.books
      .map(book => this.props.shelvedBooks.find(b => book.id === b.id) || book)

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text" onChange={this.onSeachChange} placeholder="Search by title or author"/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books && books.map(book => {
              return (
              <li key={book.id}>
                <BookListing book={book} onMoveBook={this.props.addBookToShelf} />
              </li>
            )})}
          </ol>
        </div>
      </div>
    )
  }

}

export default BookSearch