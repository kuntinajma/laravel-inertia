import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm, usePage } from '@inertiajs/react';
import TextEditor from "@/Components/TextEditor";

dayjs.extend(relativeTime);

export default function Chirp({ chirp }) {
    const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);

    const { data, setData, patch, clearErrors, reset, errors } = useForm({
        message: chirp.message,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('chirps.update', chirp.id), { onSuccess: () => setEditing(false) });
    };

    const trixInput = useRef(chirp.message);

    useEffect(() => {
        // Ensure the Trix editor is initialized before setting content
        if (trixInput.current && trixInput.current.editor) {
            trixInput.current.editor.loadHTML(chirp.message);
        }


    }, [editing, chirp.message]);

    const [state, setState] = useState({ content: '' });

    const handleContentChange = (content) => {
        setData('message', content);
    };


    const cancelEditing = () => {
        setEditing(false);
        reset({ message: chirp.message });
        clearErrors();
    };

    return (
        <div className="p-6 flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600">{dayjs(chirp.created_at).fromNow()}</small>
                        {chirp.created_at !== chirp.updated_at && <small className="text-sm text-gray-600"> &middot; edited</small>}
                    </div>
                    {chirp.user.id === auth.user.id &&
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => setEditing(true)}>
                                    Edit
                                </button>
                                <Dropdown.Link as="button" href={route('chirps.destroy', chirp.id)} method="delete">
                                    Delete
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    }
                </div>
                {editing
                    ? <div className="w-full">
                        <form onSubmit={submit} className="flex flex-col w-full max-w-full">
                            <div className="overflow-auto">
                                <TextEditor initialValue={chirp.message} onChange={handleContentChange} className="overflow-auto" />
                            </div>
                            <InputError message={errors.message} className="mt-2" />
                            <div className="space-x-2">
                                <PrimaryButton className="mt-4">Save</PrimaryButton>
                                <button className="mt-4" onClick={cancelEditing}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    : <div className='mt-4 flex flex-row justify-start items-center'>
                            {chirp.image && (
                                <img
                                    src={`/storage/${chirp.image}`}
                                    alt="Chirp"
                                    className='w-24 h-24 mr-4 cover'
                                />
                            )}
                            <div className='flex justify-center flex-col'>
                                <span id="empty-toolbar"></span>
                                <trix-editor
                                    ref={trixInput}
                                    class="trix-editor w-full h-full border-none"
                                    readonly
                                    toolbar="empty-toolbar"
                                />
                            </div>
                    </div>
                }
            </div>
        </div>
    );
}
