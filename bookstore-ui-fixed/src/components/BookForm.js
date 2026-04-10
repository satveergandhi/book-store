import { useState } from "react";
import { addBook } from "../services/BookService";
import { useNavigate } from "react-router-dom";

function BookForm(){
    const [bookName,setBookName] = useState("");
    const [author,setAuthor] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addBook({ bookName, author });

        navigate("/");
    };

    return(
        <form onSubmit={handleSubmit}>
            <input 
                placeholder="Book Name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
            />

            <input 
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />

            <button type="submit">Save</button>
        </form>
    );
}

export default BookForm;