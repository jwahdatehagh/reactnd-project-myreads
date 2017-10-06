import React from 'react'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import './App.css'
import BookShelf from './BookShelf'
import BookSearch from './BookSearch'

class BooksApp extends React.Component {

  state = {
    books: []
  }

  constructor(props) {
    super(props)
    this.moveBook = this.moveBook.bind(this)
    this.updateBook = this.updateBook.bind(this)
  }

  componentDidMount() {
    this.populateBooks()
  }

  /**
   * Get the initial books collection from the API.
   */
  populateBooks() {
    return BooksAPI.getAll().then(books => {
      this.setBooks(books)
    })
  }

  /**
   * Update a book's shelf on the API and move the book locally.
   */
  async moveBook(book, newShelf) {
    const oldShelf = book.shelf

    // Put the book on its new shelf (Optimistic instant update).
    this.locallyMoveBook(book, newShelf)

    // Save to the API
    try {
      await this.updateBook(book, newShelf)
    } catch (e) {
      // Update didn't work => Move the book back to where it was...
      this.locallyMoveBook(book, oldShelf)
      alert('Something went wrong. Please try again later.')
    }
  }

  /**
   * Save a book to a shelf and repopulate our books.
   */
  async updateBook(book, newShelf) {
    await BooksAPI.update(book, newShelf)
    await this.populateBooks()
  }

  /**
   * Move the book to a new shelf in the local store (instant, optimistic UI update).
   */
  locallyMoveBook(book, newShelf) {
    const books = this.state.books
      .map(b => {
        if (b.id === book.id) {
          b.shelf = newShelf
        }
        return b
      })

    this.setBooks(books)
  }

  /**
   * Update the local store with sorted books.
   */
  setBooks(books) {
    books = books.sort(sortBy('title'))
    this.setState({ books })
  }

  render() {
    const books = this.state.books

    // Our 3 shelves
    const currentlyReading = books.filter(book => book.shelf === 'currentlyReading')
    const wantToRead = books.filter(book => book.shelf === 'wantToRead')
    const read = books.filter(book => book.shelf === 'read')

    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <BookShelf title="Currently Reading" books={currentlyReading} onMoveBook={this.moveBook} />
              <BookShelf title="Want to Read" books={wantToRead} onMoveBook={this.moveBook} />
              <BookShelf title="Read" books={read} onMoveBook={this.moveBook} />
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
        <Route path='/search' render={({ history }) => (
          <BookSearch shelvedBooks={books} addBookToShelf={this.updateBook} />
        )}/>
      </div>
    )
  }

}

export default BooksApp
