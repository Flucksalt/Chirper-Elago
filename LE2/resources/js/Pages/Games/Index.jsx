import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';

export default function Index({ auth, games }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility (add/edit)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State to manage details modal visibility
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // State for delete confirmation
    const [selectedGame, setSelectedGame] = useState(null); // Store selected game for details or deletion
    const { data, setData, post, put, delete: destroy, processing, reset, errors, setError } = useForm({
        id: null,
        name: '',
        studio: '',
        genre: '',
        review: '',
    });

    const validateFields = () => {
        if (!data.name || !data.studio || !data.genre || !data.review) {
            if (!data.name) setError('name', 'The game name is required');
            if (!data.studio) setError('studio', 'The studio is required');
            if (!data.genre) setError('genre', 'The genre is required');
            if (!data.review) setError('review', 'The review is required');
            return false;
        }
        return true;
    };

    const submit = (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        if (data.id) {
            put(route('games.update', data.id), { onSuccess: () => reset() });
        } else {
            post(route('games.store'), { onSuccess: () => reset() });
        }
        setIsModalOpen(false); // Close the modal after submitting
    };

    const editGame = (game) => {
        setData({
            id: game.id,
            name: game.name,
            studio: game.studio,
            genre: game.genre,
            review: game.review,
        });
        setIsModalOpen(true); // Open the modal in edit mode
    };

    const openDeleteConfirm = (game) => {
        setSelectedGame(game);
        setIsDeleteConfirmOpen(true); // Open the delete confirmation modal
    };

    const deleteGame = () => {
        if (selectedGame) {
            destroy(route('games.destroy', selectedGame.id));
            setIsDeleteConfirmOpen(false); // Close the delete confirmation modal after deleting
        }
    };

    const openDetailsModal = (game) => {
        setSelectedGame(game); // Set the selected game to show in the details modal
        setIsDetailsModalOpen(true); // Open the modal for showing details
    };

    const openModal = () => {
        setData({
            id: null,
            name: '',
            studio: '',
            genre: '',
            review: '',
        });
        setIsModalOpen(true); // Open the modal for adding a new game
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setIsDetailsModalOpen(false); // Close the details modal
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Games List" />
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <button
                    onClick={openModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add Game
                </button>

                {/* Modal for adding/editing a game */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">{data.id ? 'Edit Game' : 'Add Game'}</h2>
                            <form onSubmit={submit}>
                                <input
                                    type="text"
                                    value={data.name}
                                    placeholder="Game Name - Required"
                                    className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />

                                <input
                                    type="text"
                                    value={data.studio}
                                    placeholder="Studio - Required"
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('studio', e.target.value)}
                                />
                                <InputError message={errors.studio} className="mt-2" />

                                <input
                                    type="text"
                                    value={data.genre}
                                    placeholder="Genre - Required"
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('genre', e.target.value)}
                                />
                                <InputError message={errors.genre} className="mt-2" />

                                <select
                                    value={data.review}
                                    className="block w-full mt-4 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    onChange={e => setData('review', e.target.value)}
                                >
                                    <option value="">Review - Required</option>
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                </select>
                                <InputError message={errors.review} className="mt-2" />

                                <div className="flex justify-between mt-4">
                                    <PrimaryButton className="bg-indigo-600" disabled={processing}>
                                        {data.id ? 'Update Game' : 'Add Game'}
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
                {isDetailsModalOpen && selectedGame && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Game Details</h2>
                            <div>
                                <p><strong>Name:</strong> {selectedGame.name}</p>
                                <p><strong>Studio:</strong> {selectedGame.studio}</p>
                                <p><strong>Genre:</strong> {selectedGame.genre}</p>
                                <p><strong>Review:</strong> {selectedGame.review}</p>
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
                            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this game?</h2>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={deleteGame}
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
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Studio</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Review</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game) => (
                                <tr key={game.id} className="bg-white border-b">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.studio}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.genre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.review}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => openDetailsModal(game)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => editGame(game)}
                                            className="text-blue-600 hover:text-blue-900 ml-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteConfirm(game)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
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
