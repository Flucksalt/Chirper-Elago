import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';

export default function Index({ auth, mayors }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility (add/edit)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State to manage details modal visibility
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // State for delete confirmation
    const [selectedMayor, setSelectedMayor] = useState(null); // Store selected mayor for details or deletion
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        id: null,
        name: '',
        age: '',
        address: '',
        city: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (data.id) {
            put(route('mayors.update', data.id), { onSuccess: () => reset() });
        } else {
            post(route('mayors.store'), { onSuccess: () => reset() });
        }
        setIsModalOpen(false); // Close the modal after submitting
    };

    const editMayor = (mayor) => {
        setData({
            id: mayor.id,
            name: mayor.name,
            age: mayor.age,
            address: mayor.address,
            city: mayor.city,
        });
        setIsModalOpen(true); // Open the modal in edit mode
    };

    const openDeleteConfirm = (mayor) => {
        setSelectedMayor(mayor);
        setIsDeleteConfirmOpen(true); // Open the delete confirmation modal
    };

    const deleteMayor = () => {
        if (selectedMayor) {
            destroy(route('mayors.destroy', selectedMayor.id));
            setIsDeleteConfirmOpen(false); // Close the delete confirmation modal after deleting
        }
    };

    const openDetailsModal = (mayor) => {
        setSelectedMayor(mayor); // Set the selected mayor to show in the details modal
        setIsDetailsModalOpen(true); // Open the modal for showing details
    };

    const openModal = () => {
        setData({
            id: null,
            name: '',
            age: '',
            address: '',
            city: '',
        });
        setIsModalOpen(true); // Open the modal for adding a new mayor
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setIsDetailsModalOpen(false); // Close the details modal
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Mayors List" />
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <button
                    onClick={openModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add Mayor
                </button>

                {/* Modal for adding/editing a mayor */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">{data.id ? 'Edit Mayor' : 'Add Mayor'}</h2>
                            <form onSubmit={submit}>
                                <input
                                    type="text"
                                    value={data.name}
                                    placeholder="Mayor's Name"
                                    className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />

                                <input
                                    type="number"
                                    value={data.age}
                                    placeholder="Age"
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('age', e.target.value)}
                                />
                                <InputError message={errors.age} className="mt-2" />

                                <input
                                    type="text"
                                    value={data.address}
                                    placeholder="Address"
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} className="mt-2" />

                                <input
                                    type="text"
                                    value={data.city}
                                    placeholder="City"
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('city', e.target.value)}
                                />
                                <InputError message={errors.city} className="mt-2" />

                                <div className="flex justify-between mt-4">
                                    <PrimaryButton className="bg-indigo-600" disabled={processing}>
                                        {data.id ? 'Update Mayor' : 'Add Mayor'}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Details Modal (Read-only) */}
                {isDetailsModalOpen && selectedMayor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Mayor Details</h2>
                            <div>
                                <p><strong>Name:</strong> {selectedMayor.name}</p>
                                <p><strong>Age:</strong> {selectedMayor.age}</p>
                                <p><strong>Address:</strong> {selectedMayor.address}</p>
                                <p><strong>City:</strong> {selectedMayor.city}</p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this mayor?</h2>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={deleteMayor}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Age</th>
                                <th className="p-4 text-left">Address</th>
                                <th className="p-4 text-left">City</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mayors.map(mayor => (
                                <tr key={mayor.id} className="border-b">
                                    <td className="p-4">{mayor.name}</td>
                                    <td className="p-4">{mayor.age}</td>
                                    <td className="p-4">{mayor.address}</td>
                                    <td className="p-4">{mayor.city}</td>
                                    <td className="p-4 flex space-x-4">
                                        <button
                                            onClick={() => editMayor(mayor)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteConfirm(mayor)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => openDetailsModal(mayor)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
