import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import TextEditor from "@/Components/TextEditor";
 
export default function Index({ auth, title, user, chirps}) {
   
    const state = useState({content: ''});

    const handleContentChange = (content) => {
        setState({content : content});
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        image: null,
    });
 
    const submit = (e) => {
        e.preventDefault();

        // Get the Trix editor's content (the message)
        const trixMessage = document.querySelector("trix-editor").value;

        // Gunakan FormData untuk menangani file upload
        const formData = new FormData();
        formData.append('message', trixMessage);
        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('chirps.store'), {
            data: formData, // Kirim FormData
            onSuccess: () => reset(),
        });
    };
 
    return (
        <AuthenticatedLayout>
            <Head title={title} />
 
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                <label className="block mb-2 font-medium">Image:</label>
                <input
                    className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    type="file"
                    accept="image/*"
                    onChange={e => setData('image', e.target.files[0])}
                />
                    <TextEditor onChange={handleContentChange} />
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={e => setData('message',e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>Chirp</PrimaryButton>
                </form>
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map(chirp =>
                        <Chirp key={chirp.id} chirp={chirp} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}