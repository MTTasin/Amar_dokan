import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { Search, ChevronDown, Filter } from 'lucide-react';

// Debounce hook to delay function execution
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const FilterSection = ({ title, items, selectedItems, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="py-4 border-b border-border-light">
            <button 
                className="w-full flex justify-between items-center font-semibold text-text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 space-y-2">
                    {items.map(item => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                                checked={selectedItems.includes(item.name)}
                                onChange={() => onSelectionChange(item.name)}
                            />
                            <span className="text-sm">{item.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <nav className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-border-light rounded-md disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-border-light rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
};


const ShopPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { items: products, pagination, listStatus } = useSelector((state) => state.products);
    const { items: categories } = useSelector((state) => state.categories);
    const { colors, sizes } = useSelector((state) => state.filters);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    const activeFilters = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        category: searchParams.get('category') || '',
        colors: searchParams.getAll('colors') || [],
        sizes: searchParams.getAll('sizes') || [],
        search: searchParams.get('search') || '',
    }), [searchParams]);

    const updateFilters = useCallback((newFilters) => {
        const currentParams = new URLSearchParams(searchParams);
        
        Object.entries(newFilters).forEach(([key, value]) => {
            currentParams.delete(key);
            if (Array.isArray(value)) {
                value.forEach(v => currentParams.append(key, v));
            } else if (value) {
                currentParams.set(key, value);
            }
        });
        
        if (!('page' in newFilters)) {
            currentParams.set('page', '1');
        }

        setSearchParams(currentParams);
    }, [searchParams, setSearchParams]);
    
    // EFFECT: Re-fetch products when active filters (derived from URL) change
    useEffect(() => {
        dispatch(fetchProducts(activeFilters));
    }, [dispatch, activeFilters]);

    // EFFECT: Update URL when debounced search term changes
    useEffect(() => {
        updateFilters({ search: debouncedSearchTerm });
    }, [debouncedSearchTerm, updateFilters]);
    
    const handleCategoryChange = (e) => {
        updateFilters({ category: e.target.value });
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(pagination.count / 12)) {
            updateFilters({ page: newPage });
        }
    };
    
    const handleMultiSelectChange = (key, value) => {
        const currentValues = activeFilters[key];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        updateFilters({ [key]: newValues });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">Our Collection</h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-text-secondary">
                    Browse through our curated selection of premium menswear.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={`lg:w-64 lg:flex-shrink-0 ${isFilterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-border-light sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Filters</h3>
                        <div className="py-4 border-b border-border-light">
                            <label htmlFor="category-select" className="font-semibold text-text-primary">Category</label>
                            <select 
                                id="category-select"
                                value={activeFilters.category}
                                onChange={handleCategoryChange}
                                className="mt-2 w-full bg-gray-200 text-text-primary rounded-md py-2 px-3 appearance-none focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            >
                                <option value="">All</option>
                                {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                            </select>
                        </div>
                        <FilterSection 
                            title="Color"
                            items={colors.items}
                            selectedItems={activeFilters.colors}
                            onSelectionChange={(colorName) => handleMultiSelectChange('colors', colorName)}
                        />
                        <FilterSection 
                            title="Size"
                            items={sizes.items}
                            selectedItems={activeFilters.sizes}
                            onSelectionChange={(sizeName) => handleMultiSelectChange('sizes', sizeName)}
                        />
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="flex-grow">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex-grow max-w-lg flex items-center">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white text-text-primary rounded-l-md py-2 px-4 w-full border border-border-light focus:ring-2 focus:ring-brand-orange focus:outline-none" 
                            />
                            <button className="bg-brand-orange p-2.5 rounded-r-md">
                                <Search size={20} className="text-white"/>
                            </button>
                        </div>
                        <button 
                            className="lg:hidden p-2 bg-white border border-border-light rounded-md ml-4"
                            onClick={() => setFilterSidebarOpen(!isFilterSidebarOpen)}
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                    
                    {listStatus === 'loading' && <Spinner />}
                    {listStatus === 'failed' && <p className="text-center text-red-500">Could not load products.</p>}
                    {listStatus === 'succeeded' && (
                        products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <Pagination 
                                    currentPage={activeFilters.page}
                                    totalPages={Math.ceil(pagination.count / 12)}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-semibold text-text-primary">No Products Found</h3>
                                <p className="text-text-secondary mt-2">Try adjusting your search or filter criteria.</p>
                            </div>
                        )
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopPage;
