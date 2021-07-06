// Berkas Routes

const {
  addBooksHandler,
  getAllBooksHandler,
  getBooksbyIdHandler,
  editBookbyIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksbyIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookbyIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
