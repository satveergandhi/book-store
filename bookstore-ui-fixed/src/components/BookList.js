import { useEffect, useState } from "react";
import { getAllBooks } from "../services/BookService";

function BookList(){
    const[books, setBooks] = useState([]);
    const[page, setPage] = useState(0);
    const[size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    console.log(books);
    useEffect(() => {
        loadBooks();
    }, [page]);

    const loadBooks = async() => {
        const data = await getAllBooks(page, size);
        setBooks(data.content);
        setTotalPages(data.totalPages);
    };
    return(
    <div>   
        <h2>
            All Books
        </h2>

        {books.length === 0 ? (
            <p>
                No books found
            </p>
        ) : (
            books.map((b) => (
                <div key={b.bookId}>
                    {b.bookName} - {b.author}
                </div>
            ))
        )}
    </div>
);
}

export default BookList;