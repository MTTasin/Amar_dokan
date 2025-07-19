const Pagination = ({ currentPage = 0 }) => {
  const pageNumber = currentPage + 1;

  return (
    <div className="flex justify-center py-4">
      <p className="text-lg font-semibold text-gray-700">
        Page {pageNumber}
      </p>
    </div>
  );
};

export default Pagination;
