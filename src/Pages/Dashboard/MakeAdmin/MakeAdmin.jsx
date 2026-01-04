import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaSearch, FaShieldAlt, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    // const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    // Fetch admin stats
    const { data: stats, refetch } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/admin/stats');
            return data.stats;
        }
    });

    // Search users mutation
    const searchMutation = useMutation({
        mutationFn: async (query) => {
            const { data } = await axiosSecure.get(`/users/search?query=${encodeURIComponent(query)}`);
            return data;
        },
        onSuccess: (data) => {
            if (data.users.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'No Results',
                    text: 'No users found matching your search',
                    confirmButtonColor: '#3085d6'
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Search Failed',
                text: error.response?.data?.message || 'Failed to search users',
                confirmButtonColor: '#3085d6'
            });
        }
    });

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const { data } = await axiosSecure.patch(`/users/${userId}/role`, { role });
            return data;
        },
        onSuccess: (data) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message,
                confirmButtonColor: '#3085d6'
            });

            setSelectedUser(data.user);

            refetch();
            setSearchQuery('');
            searchMutation.reset();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update user role',
                confirmButtonColor: '#3085d6'
            });
        }
    });

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Search',
                text: 'Please enter a search query',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        setSelectedUser(null);
        searchMutation.mutate(searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const makeAdmin = (userId) => {
        Swal.fire({
            title: 'Make Admin?',
            text: 'Are you sure you want to grant admin privileges to this user?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Make Admin',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId, role: 'admin' });
            }
        });
    };

    const removeAdmin = (userId) => {
        Swal.fire({
            title: 'Remove Admin?',
            text: 'Are you sure you want to remove admin privileges from this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Remove Admin',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId, role: 'user' });
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const searchResults = searchMutation.data?.users || [];

    return (
        <div className="min-h-screen bg-base-200">
            <div className="bg-primary text-primary-content py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
                    <p className="text-lg opacity-90">User Management Dashboard</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Section */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-primary">
                                <FaUser className="text-3xl" />
                            </div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-primary">{stats.totalUsers}</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-secondary">
                                <FaShieldAlt className="text-3xl" />
                            </div>
                            <div className="stat-title">Admins</div>
                            <div className="stat-value text-secondary">{stats.totalAdmins}</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-accent">
                                <FaUser className="text-3xl" />
                            </div>
                            <div className="stat-title">Regular Users</div>
                            <div className="stat-value text-accent">{stats.regularUsers}</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-success">
                                <FaCalendar className="text-3xl" />
                            </div>
                            <div className="stat-title">New (7 days)</div>
                            <div className="stat-value text-success">{stats.recentUsers}</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Search Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Search Users</h2>

                            <div className="space-y-4">
                                <div className="form-control">
                                    <div className="input-group flex">
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            className="input input-bordered w-full"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="btn btn-primary"
                                            disabled={searchMutation.isPending}
                                        >
                                            {searchMutation.isPending ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <FaSearch />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-3">
                                        Search Results ({searchResults.length})
                                    </h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user._id}
                                                onClick={() => setSelectedUser(user)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedUser?._id === user._id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-base-300 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 flex justify-between items-center">
                                                        <div className="flex-col items-center gap-2">
                                                            <p className="font-semibold">{user.name}</p>
                                                            <p className="text-sm text-base-content/60">{user.email}</p>
                                                        </div>
                                                        {user.role === 'admin' && (
                                                            <span className="badge badge-primary badge-sm gap-1">
                                                                <FaShieldAlt className="text-xs" />
                                                                Admin
                                                            </span>
                                                        )}
                                                        {user.role === 'rider' && (
                                                            <span className="badge badge-info badge-sm">Rider</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right ml-2">
                                                        <p className="text-xs text-base-content/60">
                                                            {user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Details Section */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">User Details</h2>

                            {!selectedUser ? (
                                <div className="text-center py-12 text-base-content/60">
                                    <FaUser className="text-5xl mx-auto mb-4 opacity-50" />
                                    <p>Search and select a user to view details</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-primary-content flex justify-center items-center rounded-full w-12">
                                                    <span className="text-xl">
                                                        {selectedUser.name?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{selectedUser.name || 'No Name'}</h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {selectedUser.role === 'admin' ? (
                                                        <span className="badge badge-primary gap-1">
                                                            <FaShieldAlt />
                                                            Administrator
                                                        </span>
                                                    ) : selectedUser.role === 'rider' ? (
                                                        <span className="badge badge-info gap-1">Rider</span>
                                                    ) : (
                                                        <span className="badge badge-ghost gap-1">
                                                            <FaUser />
                                                            Regular User
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <FaEnvelope className="text-xl text-base-content/60 mt-1" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">Email</p>
                                                    <p className="font-medium">{selectedUser.email}</p>
                                                </div>
                                            </div>

                                            {selectedUser.createdAt && (
                                                <div className="flex items-start gap-3">
                                                    <FaCalendar className="text-xl text-base-content/60 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-base-content/60">Created At</p>
                                                        <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedUser.lastLogIn && (
                                                <div className="flex items-start gap-3">
                                                    <FaCalendar className="text-xl text-base-content/60 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-base-content/60">Last Login</p>
                                                        <p className="font-medium">{formatDate(selectedUser.lastLogIn)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="divider"></div>

                                            <div className="flex items-start gap-3">
                                                <FaUser className="text-xl text-base-content/60 mt-1" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">User ID</p>
                                                    <p className="font-mono text-sm break-all">{selectedUser._id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {selectedUser.role === 'admin' ? (
                                            <button
                                                onClick={() => removeAdmin(selectedUser._id)}
                                                className="btn btn-error btn-block gap-2"
                                                disabled={updateRoleMutation.isPending}
                                            >
                                                {updateRoleMutation.isPending ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <>
                                                        <MdAdminPanelSettings className="text-xl" />
                                                        Remove Admin Privileges
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => makeAdmin(selectedUser._id)}
                                                className="btn btn-success btn-block gap-2"
                                                disabled={updateRoleMutation.isPending}
                                            >
                                                {updateRoleMutation.isPending ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <>
                                                        <FaShieldAlt className="text-xl" />
                                                        Make Admin
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <div className="alert alert-warning">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span className="text-sm">
                                                Changing user roles is permanent and will affect their access immediately.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakeAdmin;