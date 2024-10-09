const Pagination = ({currentPage = 0}) => {
    const pageNumber = currentPage + 1;

    return (
        <div className="flex justify-center">
            <p className="text-gray-500">
                Page {pageNumber}
            </p>
        </div>
    );
};

export default Pagination;
