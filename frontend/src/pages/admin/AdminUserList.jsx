import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, updateUserAdmin, deleteUser, clearUpdateStatus } from '../../store/usersSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2 } from 'lucide-react';

// --- Edit User Modal Component ---
const EditUserModal = ({ user, roles, onClose, onSave, updateStatus }) => {
    const [isActive, setIsActive] = useState(user.is_active);
    const [isStaff, setIsStaff] = useState(user.is_staff);
    const [selectedRoleIds, setSelectedRoleIds] = useState(user.groups.map(g => g.id));

    const handleRoleChange = (roleId) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    const handleSave = () => {
        const userData = {
            is_active: isActive,
            is_staff: isStaff,
            group_ids: selectedRoleIds,
            name: user.name,
        };
        onSave(user.id, userData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-6">Edit User: {user.name}</h3>
                <div className="space-y-6">
                    {/* Status Toggles */}
                    <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                            User is Active
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
                            User is Staff
                        </label>
                    </div>

                    {/* Role Management */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Roles</label>
                        <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={role.id}
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => handleRoleChange(role.id)}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-border-light">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={updateStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                        {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main User List Component ---
const AdminUserList = () => {
    const dispatch = useDispatch();
    const { users, roles, status, updateStatus } = useSelector(state => state.users);
    const { user: currentUser } = useSelector(state => state.auth); // Get the currently logged-in user
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        if (updateStatus === 'succeeded') {
            setEditingUser(null);
            dispatch(clearUpdateStatus());
        }
    }, [updateStatus, dispatch]);

    const handleSaveUser = (userId, userData) => {
        dispatch(updateUserAdmin({ userId, userData }));
    };

    // NEW: Handler for deleting a user
    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            dispatch(deleteUser(userId));
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    roles={roles}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                    updateStatus={updateStatus}
                />
            )}

            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Users</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Roles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                    {user.groups.map(g => g.name).join(', ') || 'User'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    {/* Prevent admin from deleting themselves */}
                                    {currentUser?.id !== user.id && (
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserList;
