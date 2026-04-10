import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import SearchBook from "./pages/SearchBook";

function App() {
  return(
    <BrowserRouter>
    <nav style={{
      display: "flex",
      gap: "20px",
      backgroundColor: "#f0f0f0",
      padding: "10px"
      }}>
      <Link to="/">Home</Link>
      <Link to="/add">Add Book</Link>
      <Link to="/search">Search Book</Link>
    </nav>

    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/add" element={<AddBook />}/>
      <Route path="/search" element={<SearchBook />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;