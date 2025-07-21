import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchColors, createColor, deleteColor,
    fetchSizes, createSize, deleteSize,
    clearMutationStatus
} from '../../store/filtersSlice';
import Spinner from '../../components/Spinner';
import { Trash2 } from 'lucide-react';

// Reusable component for managing a list of attributes (Color or Size)
const AttributeManager = ({ title, items, onAdd, onDelete, mutationStatus, children }) => (
    <div className="p-6 border border-border-light rounded-lg">
        <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
        <form onSubmit={onAdd} className="flex gap-2 mb-4">
            {children}
            <button type="submit" disabled={mutationStatus === 'loading'} className="bg-brand-orange text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                {mutationStatus === 'loading' ? 'Adding...' : 'Add'}
            </button>
        </form>
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                        {item.hex_code && <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: item.hex_code }}></div>}
                        <span className="text-sm">{item.name}</span>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);


const AdminAttributesPage = () => {
    const dispatch = useDispatch();
    const { colors, sizes, mutationStatus, mutationError } = useSelector(state => state.filters);

    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');
    const [newSizeName, setNewSizeName] = useState('');

    useEffect(() => {
        // Clear any previous errors when the component loads
        dispatch(clearMutationStatus());
    }, [dispatch]);

    const handleAddColor = (e) => {
        e.preventDefault();
        if (newColorName && newColorHex) {
            dispatch(createColor({ name: newColorName, hex_code: newColorHex }));
            setNewColorName('');
            setNewColorHex('#000000');
        }
    };

    const handleAddSize = (e) => {
        e.preventDefault();
        if (newSizeName) {
            dispatch(createSize({ name: newSizeName }));
            setNewSizeName('');
        }
    };

    const handleDeleteColor = (id) => {
        if (window.confirm('Are you sure you want to delete this color?')) {
            dispatch(deleteColor(id));
        }
    };

    const handleDeleteSize = (id) => {
        if (window.confirm('Are you sure you want to delete this size?')) {
            dispatch(deleteSize(id));
        }
    };

    return (
        <div>
            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Attributes</h2>
                <p className="text-sm text-text-secondary mt-1">Add or remove colors and sizes available for products.</p>
            </div>

            {mutationStatus === 'failed' && <p className="text-red-500 text-sm mb-4">Error: {mutationError}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Color Manager */}
                <AttributeManager
                    title="Colors"
                    items={colors.items}
                    onAdd={handleAddColor}
                    onDelete={handleDeleteColor}
                    mutationStatus={mutationStatus}
                >
                    <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="Color Name (e.g., Blue)"
                        className="form-input w-full"
                        required
                    />
                    <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="form-input p-1 h-10 w-12"
                    />
                </AttributeManager>

                {/* Size Manager */}
                <AttributeManager
                    title="Sizes"
                    items={sizes.items}
                    onAdd={handleAddSize}
                    onDelete={handleDeleteSize}
                    mutationStatus={mutationStatus}
                >
                    <input
                        type="text"
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        placeholder="Size Name (e.g., XL)"
                        className="form-input w-full"
                        required
                    />
                </AttributeManager>
            </div>
        </div>
    );
};

export default AdminAttributesPage;
