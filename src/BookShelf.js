import React from 'react'
import PropTypes from 'prop-types'
import BookListing from './BookListing'

class BookShelf extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    onMoveBook: PropTypes.func.isRequired
  }

  render() {
    const title = this.props.title
    const books = this.props.books

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.map(book => (
              <li key={book.id}>
                <BookListing book={book} onMoveBook={this.props.onMoveBook} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

}

export default BookShelf