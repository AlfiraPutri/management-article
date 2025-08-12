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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
    )
    .reduce<(number | string)[]>((acc, page, idx, arr) => {
      if (idx > 0 && arr[idx - 1] !== page - 1) {
        acc.push("...");
      }
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 text-gray-700 disabled:text-gray-400"
      >
        &lt; Previous
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 text-gray-700">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 rounded-md text-gray-700 ${
              page === currentPage ? "border border-gray-400" : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 text-gray-700 disabled:text-gray-400"
      >
        Next &gt;
      </button>
    </div>
  );
}
