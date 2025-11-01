interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="page-btn">
            {/* Previous */}
            {currentPage > 1 && (
                <span onClick={handlePrev} style={{ cursor: 'pointer' }}>
                    &#8592;
                </span>
            )}

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                    <span
                        key={page}
                        onClick={() => onPageChange(page)}
                        style={{
                            background: currentPage === page ? '#ff523b' : '',
                            color: currentPage === page ? '#fff' : '',
                            cursor: 'pointer',
                        }}
                    >
                        {page}
                    </span>
                );
            })}

            {/* Next */}
            {currentPage < totalPages && (
                <span onClick={handleNext} style={{ cursor: 'pointer' }}>
                    &#8594;
                </span>
            )}
        </div>
    );
}
