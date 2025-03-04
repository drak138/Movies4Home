import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Pagination({ query, totalPages, currentPage }) {
    const navigate = useNavigate();
    
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(10);

    useEffect(() => {
        // Ensure the page range is calculated properly when `currentPage` changes
        const adjustedStartPage = Math.max(1, currentPage - 4);
        const adjustedEndPage = Math.min(totalPages, adjustedStartPage + 9);

        setStartPage(adjustedStartPage);
        setEndPage(adjustedEndPage);
    }, [currentPage, totalPages]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            // Update the URL to reflect the new page number
            navigate(`/search/${query}/${newPage}`);
        }
    };

    // Create the range of pages to display
    const pageRange = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="pagination">
            <div className="arrows">
            <i
                className="fa-solid fa-angles-left"
                onClick={() => handlePageChange(1)}
            ></i>
            <i className="fa-solid fa-chevron-left" 
            onClick={() => handlePageChange(Number(currentPage) - 1)}
            ></i>
            </div>
            <div className="pages">
                {/* Render the pages dynamically */}
                {pageRange.map((page) => (
                    <span
                        key={page}
                        className={currentPage === page ? "active" : ""}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </span>
                ))}
            </div>
            <div className="arrows">
            <i className="fa-solid fa-chevron-right" 
            onClick={() => handlePageChange(Number(currentPage) + 1)}
            ></i>
            <i
                className="fa-solid fa-angles-right"
                onClick={() => handlePageChange(totalPages)}
            ></i>
            </div>
        </div>
    );
}


