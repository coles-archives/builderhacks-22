import { Plus, LogIn, Info } from 'lucide-react';
import Swal from "sweetalert2";
import jscookie from 'js-cookie';
import { useRouter } from "next/router";

export default function Home({ notes, user }) {
    const router = useRouter()

    // make a new note
    const newNote = (e) => {
        Swal.fire({
            title: 'New Note',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Create',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#FF8882',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            preConfirm: async (title) => {
                if (notes.find(n => n.title == title)) {
                    Swal.showValidationMessage(
                        `Note with title "${title}" already exists.`
                    )
                    return
                }

                const api = await fetch(`/api/notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title })
                }).then(res => res.json());

                if (api.error) {
                    Swal.showValidationMessage(`${api.error}`)
                    return
                } else {
                    window.location.href = `/notes/${api.user}/${api.id}`
                }
            },
        });
    };

    // login as new user
    const logIn = (e) => {
        Swal.fire({
            title: 'Log In',
            text: 'Enter your user ID here.',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Login',
            confirmButtonColor: '#FF8882',
            showLoaderOnConfirm: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            preConfirm: async (userid) => {
                router.reload(window.location.pathname);
                jscookie.set('user', userid);
            },
        });
    };

    // show info
    const inform = (e) => {
        Swal.fire({
            title: 'Info',
            icon: 'info',
            confirmButtonColor: '#FF8882',
            html:
                'This platform was made for the <a href="https://hacks.buildergroop.com/">Builderhacks 2022 hackathon</a> using NextJS, TailwindCSS, Supabase, Sweetalert, and 2 hours of sleep by <a href="https://coleh.lol">Cole Harris</a>.',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    };

    return (
        <>
            <div className="bg-gray-200">
                <div className="rounded-2xl p-4">
                    <h1 className="text-2xl font-bold">
                        Lotus - Visual note taking with a twist.
                    </h1>

                    {jscookie.get('user')
                        ? <p>Lotus is a minimal visual note taking app. • <b>You are logged in as:</b> {jscookie.get('user')} • <b>Your notes:</b> {notes.length}</p>
                        : <p className="text-gray-700">Lotus is a minimal visual note taking app.</p>
                    }
                </div>
            </div>
            <div className="bg-white w-full h-full">
                <button onClick={(e) => newNote(e)} className="absolute right-0 lg:m-4">
                    <Plus />
                </button>

                <button onClick={(e) => logIn(e)} className="absolute left-0 lg:m-4">
                    <LogIn />
                </button>

                <button onClick={(e) => inform(e)} className="absolute left-0 bottom-0 lg:m-4">
                    <Info />
                </button>

                {Array.isArray(notes) && notes.length > 0 ? notes.map(note => (
                    <div className="flex flex-col items-center justify-center h-full">
                        <a href={'/notes/' + note.user + '/' + note.id} key={note.id} className="w-full max-w-sm m-4 bg-gray-100 shadow-md rounded-2xl">
                            <div className="rounded-2xl p-4">
                                <h2 className="text-2xl font-bold">
                                    {note.title}
                                </h2>
                                <p className="text-gray-700">
                                    {note.content}
                                </p>
                            </div>
                        </a>
                    </div>
                )) : <div className="p-12">
                    <h1 className="text-2xl font-bold">
                        No notes yet.
                    </h1>
                    <p className="text-gray-700">
                        Create a new note to get started.
                    </p>
                </div>}
            </div>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const notes = await fetch(`http://localhost:3000/api/notes`, {
        headers: {
            'Cookie': req.headers.cookie
        }
    }).then(res => res.json());

    // Pass data to the page via props
    return { props: { notes } }
}