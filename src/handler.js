// Berkas Handler

const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 1: API dapat menyimpan buku
const addBooksHandler = (request, h) => {
  // Object buku yang dikirim oleh client
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Server gagal merespons jika Nama tidak ada
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Server gagal merespons jika jumlah buku yang dibaca lebih besar daripada halaman buku
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Object buku yang diolah dan didapatkan dari server
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Menyimpan data buku
  books.push(newBooks);

  // Response server
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Response server jika buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // Response server jika buku gagal ditambahkan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Kriteria 2 : API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let getBooks = books;

  if (name !== undefined) {
    getBooks = getBooks.filter((daftarBuku) => daftarBuku
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: getBooks
          .filter((daftarBuku) => daftarBuku.reading === !!Number(reading))
          .map((daftarBuku) => ({
            id: daftarBuku.id,
            name: daftarBuku.name,
            publisher: daftarBuku.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: getBooks
          .filter((daftarBuku) => daftarBuku.finished === !!Number(finished))
          .map((daftarBuku) => ({
            id: daftarBuku.id,
            name: daftarBuku.name,
            publisher: daftarBuku.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: getBooks.map((daftarBuku) => ({
        id: daftarBuku.id,
        name: daftarBuku.name,
        publisher: daftarBuku.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Kriteria 3 : API dapat menampilkan detail buku
const getBooksbyIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 4 : API dapat mengubah data buku
const editBookbyIdHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const { id } = request.params;
  const updatedAt = new Date().toISOString();
  const finished = (pageCount === readPage);
  const index = books.findIndex((book) => book.id === id);

  // Server gagal merespons jika Nama tidak ada
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Server gagal merespons jika jumlah buku yang dibaca lebih besar daripada halaman buku
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Server mengembalikan respons dan buku berhasil diperbarui
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Server gagal merespons jika id client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 5 : API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksbyIdHandler,
  editBookbyIdHandler,
  deleteBookByIdHandler,
};