import React from 'react'
import PropTypes from 'prop-types'

class BookListing extends React.Component {

  static propTypes = {
    book: PropTypes.object.isRequired,
    onMoveBook: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.moveBook = this.moveBook.bind(this)
  }

  moveBook(event) {
    const book = this.props.book
    const newShelf = event.target.value
    this.props.onMoveBook(book, newShelf)
  }

  render() {
    const book = this.props.book

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${book.imageLinks.smallThumbnail}")`
          }}></div>
          <div className="book-shelf-changer">
            <select value={book.shelf || 'none'} onChange={this.moveBook}>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        { book.authors ? (<div className="book-authors">{book.authors.join(', ')}</div>) : '' }
      </div>
    )
  }

}

export default BookListing
