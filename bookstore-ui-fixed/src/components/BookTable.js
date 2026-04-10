import { useEffect, useState } from "react";
import { getAllBooks, deleteBook, deleteSelectedBooks, searchBooks } from "../services/BookService";
import Swal from "sweetalert2";

function BookTable(){
    const[books, setBooks] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ bookName: "", author: "" });
    const [appliedFilters, setAppliedFilters] = useState({ bookName: "", author: "" });
    const isSearching = appliedFilters.bookName || appliedFilters.author;
    const [cache, setCache] = useState({});

    useEffect(() => {
        setCache({}); 
    }, [appliedFilters]);

    useEffect(() => {
        loadBooks();
    }, [page, appliedFilters]);

    // useEffect(() => {
    // setSelectedIds(prev => {
    //     const validIds = new Set(books.map(b => b.bookId));
    //     return new Set([...prev].filter(id => validIds.has(id)));
    //     });
    // }, [books]);

    const loadBooks = async() => {
        const key = `${page}-${JSON.stringify(appliedFilters)}`;

        if(cache[key]){
            setBooks(cache[key].books);
            setTotalPages(cache[key].totalPages);
            return;
        }

            let data;
            let result;
            if(isSearching){
                data = await searchBooks(appliedFilters);
                result = {
                    books:data || [],
                    totalPages: 1
                };
                // setBooks(result.books);
                // setTotalPages(result.totalPages);
                // setCache(prev => ({...prev, [key] : result}));
            } else{
                data = await getAllBooks(page, size);
                result = {
                    books: data?.content || [],
                    totalPages: data?.totalPages || 0
                };
            }
            
                setBooks(result.books);
                setTotalPages(result.totalPages);
                setCache(prev => ({...prev, [key] : result}));

            // setBooks(data.content || []);
    };
    
    const handleSelect = (id) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    }

    const handleSearch = async() =>{
        const data = await searchBooks(filters);
        setBooks(data);
    }

    const handleDelete = async (bookId) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
        await deleteBook(bookId);

        Swal.fire({
            toast: true,  
            position: "top-end", 
            title: "Deleted!", 
            text : "Book removed successfully✅", 
            icon : "success",
            timer: 1500,
            showConfirmButton : false
    });
            loadBooks();
    }
    };

    const handleBulkDelete = async () => {
        
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
        const idsToDel = new Set(selectedIds);
        setBooks(prev => prev.filter(b => !idsToDel.has(b.bookId)));
        setCache(prev => {
            const upd = {};
            for(const key in prev){
                upd[key] = {
                    ...prev[key],
                    books:prev[key].books.filter(b => !idsToDel.has(b.bookId))
                };
            }
            return upd;
        })
        const totDeleted = idsToDel.size;
        await deleteSelectedBooks([...idsToDel]);
        setSelectedIds(new Set());
        // setCache({});
        await loadBooks();

        Swal.fire({
            toast: true,  
            position: "top-end", 
            title: "Deleted!", 
            text : `${totDeleted} ${totDeleted > 1 ? "Books" : "Book"} removed successfully✅`, 
            icon : "success",
            timer: 1500,
            showConfirmButton : false
        });
    }
    };

    // const handleDeleteClick = (id) => {
    //     setSelectedId(id);
    //     setShowModal(true);
    // };

    // const confirmDelete = async () => {
    //     await deleteBook(selectedId);
    //     setShowModal(false);
    //     setSelectedId(null);
    //     loadBooks();
    // }

    // const handleDelete = async(bookId) => {
    //     await deleteBook(bookId);
    //     loadBooks();
    // }

    const handleSelectAllPage = () =>{
        if (books.length === 0) return;
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            const allSelected = books.every(b => newSet.has(b.bookId));

            if(allSelected){
                books.forEach(b => newSet.delete(b.bookId));
            } else{
                books.forEach(b => newSet.add(b.bookId));
            }
            return newSet;
        })
    }

    const handleSelectAll = () =>{
        setSelectedIds(new Set(books.map(b => b.bookId)));
    }

    const handleDeselectAll = () =>{
        setSelectedIds(new Set([])); 
    }

    // const handleSelectionBox = () => {
    //     if(selectedIds.size === books.length )
    //         setSelectedIds([]); 
    //     else
    //         setSelectedIds(books.map(b => b.bookId));
    // }

    return(
        <div style={{ marginBottom: "10px" }}>
    <input
        placeholder="Book Name"
        value={filters.bookName}
        onChange={e => {
            setFilters(prev => ({ ...prev, bookName: e.target.value }));
        }}
    />

    <input
        placeholder="Author"
        value={filters.author}
        onChange={e => {
            setFilters(prev => ({ ...prev, author: e.target.value }));
        }}
    />

    <button disabled={!filters.bookName && !filters.author} onClick={() => {
        setPage(0); // 
        setAppliedFilters(filters);
    }}>Search</button>

    <button disabled={!filters.bookName && !filters.author} onClick={() => {
        setFilters({ bookName: "", author: "" });
        setAppliedFilters({ bookName: "", author: "" });
        setPage(0);
    }}>
        Reset
    </button>
    <div></div>
            <button onClick={handleSelectAll} >
                 Select All
            </button>
            <button onClick={handleDeselectAll} disabled={selectedIds.size === 0}>
                Deselect All
            </button>
            <button onClick={handleBulkDelete} disabled={selectedIds.size === 0}>
            Delete Selected ({selectedIds.size})
            </button>
        <table border="1">
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={books.length > 0 && books.every(b => selectedIds.has(b.bookId))}
                            onChange={handleSelectAllPage}
                        />
                    </th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Author</th>
                    {/* <th>Action</th> */}
                </tr>
            </thead>
            <tbody>
                {books.map((b) => (
                    <tr key={b.bookId}
                    style={{
                    backgroundColor: selectedIds.has(b.bookId) ? "#ffede6" : "white"
                }}>
                        <td>
                        <input
                        type="checkbox"
                        checked={selectedIds.has(b.bookId)}
                        onChange={() => handleSelect(b.bookId)}
                        disabled={books.length==0}
                        />
                    </td>
                        <td>{b.bookId}</td>
                        <td>{b.bookName}</td>
                        <td>{b.author}</td>
                        {/* <td>
                            <button onClick={() => handleDelete(b.bookId)}>Delete</button>
                        </td> */}
                    </tr>
                ))}
            </tbody>
        </table>
        <button disabled={ isSearching || page === 0} onClick={() => setPage(p => p - 1)}>
                Prev
        </button>

        <span> Page { isSearching 
        ? `Search Results (${books.length})` : `${page + 1} of ${totalPages}`} </span>

        <button disabled={ isSearching || page === totalPages - 1 || books.length === 0} onClick={() => setPage(p => p + 1)}>
            Next
        </button>
        {/* { showModal && (
            <div style={{
            position: "fixed",
            top: "30%",
            left: "30%",
            background: "white",
            padding: "20px",
            border: "1px solid black",
          }}>
            <p>Are you sure to Delete a book record?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowModal(false)}>No</button>
            </div>
        )} */}
        </div>
    );
}
export default BookTable;