import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import TextEditor from "@/Components/TextEditor";

export default function Index({ auth, title, user, chirps}) {
    const handleContentChange = (content) => {
        setData('message', content);
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', data.message);
        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('chirps.store'), {
            data: formData,
            onSuccess: () => {
                reset();
                document.getElementById('fileInput').value = '';
                document.querySelectorAll('trix-editor')[0].value = '';
            },
        });

    };

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                <label className="block mb-2 font-medium">Image:</label>
                <input
                    id="fileInput"
                    className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    type="file"
                    accept="image/*"
                    onChange={e => setData('image', e.target.files[0])}
                />
                    <TextEditor
                        initialValue={data.message}
                        onChange={handleContentChange}
                    />
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
