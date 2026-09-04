import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import DocumentMeta from "./components/DocumentMeta.jsx";
import Home from "./pages/Home.jsx";
import AdminPage from "./pages/Admin.jsx";
import FilmsortCaseStudy from "./pages/FilmsortCaseStudy.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-[#ffffff] antialiased">
      <DocumentMeta />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/filmsort-case-study" element={<FilmsortCaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
