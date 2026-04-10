import BookList from "../components/BookList";

const BASE_URL = "http://localhost:8080/books";

export const addBook = async (book) =>{
    const res = await fetch(`${BASE_URL}/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });

    if(!res.ok) throw new Error("Failed to add book");

    return res.json();
}

export const getAllBooks = async (page, size) =>{
    const res = await fetch(`${BASE_URL}/books?page=${page}&size=${size}`);    
    if(!res.ok) throw new Error("Failed to fetch books"); 
    console.log(BookList);   
    return res.json();
};

export const searchBooks = async (filters) => {
    const res = await fetch(`${BASE_URL}/findABook?bookName=${filters.bookName}&author=${filters.author}`);
    if(!res.ok) throw new Error("Failed to search a book");
    return res.json();
}

export const deleteBook = async (id) =>{
    const res = await fetch(`${BASE_URL}/books/${id}`, {
        method : "DELETE"
    })
    if(!res.ok) throw new Error("Unable to del!");
    return res.text();
}

export const deleteSelectedBooks = async (ids) =>{
     const res = await fetch(`${BASE_URL}/books`, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",
        },
        "body" : JSON.stringify(ids),
     }
    );
    if(!res.ok) throw new Error("Failed to del!");
    return res.text();
}