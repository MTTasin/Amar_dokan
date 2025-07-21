import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct, updateProduct } from '../../store/productsSlice'; // Import updateProduct
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminProductList = () => {
    const dispatch = useDispatch();
    const { items: products, listStatus, mutationStatus } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
            dispatch(deleteProduct(productId));
        }
    };

    // NEW: Handler for the featured toggle switch
    const handleFeatureToggle = (product) => {
        const data = {
            is_featured: !product.is_featured
        };
        dispatch(updateProduct({ productId: product.id, data }));
    };

    if (listStatus === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Products</h2>
                <Link
                    to="/admin/products/new"
                    className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusCircle size={20} />
                    Add Product
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image_url} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{product.name}</div>
                                            <div className="text-sm text-text-secondary">{product.category_name}</div>
                                        </div>
                                    </div>
                                </td>
                                {/* NEW: Featured Toggle Switch */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label htmlFor={`featured-${product.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id={`featured-${product.id}`} 
                                                className="sr-only" 
                                                checked={product.is_featured}
                                                onChange={() => handleFeatureToggle(product)}
                                            />
                                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${product.is_featured ? 'translate-x-4 !bg-brand-orange' : ''}`}></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.is_available ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                        <Edit size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)} 
                                        className="text-red-600 hover:text-red-900 inline-block"
                                        disabled={mutationStatus === 'loading'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
