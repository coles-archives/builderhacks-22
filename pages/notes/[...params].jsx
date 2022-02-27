import { useRouter } from 'next/router'
import { Plus, X } from 'lucide-react'
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';
import Helmet from 'react-helmet';
import Swal from "sweetalert2";
import cookieCutter from 'cookie-cutter';

dayjs.extend(LocalizedFormat);

const Note = ({ notes, noteboxes }) => {
  const router = useRouter()
  const { params = [] } = router.query

  // new note box
  const newBox = (e) => {
    Swal.fire({
      title: 'New Note Box',
      text: 'Enter notebox content here.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#FF8882',
      showLoaderOnConfirm: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      preConfirm: async (content) => {
        const userid = cookieCutter.get('user');

        const notebox = await fetch(`/api/notebox`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: content, note: notes.find(n => n.id == params[1]).id })
        }).then(res => res.json());

        if (notebox.error) {
          Swal.showValidationMessage(`${notebox.error}`)
          return
        }

        router.reload(window.location.pathname);
        cookieCutter.set('user', userid);
      },
    });
  };

  const cnote = notes.find(n => n.id == params[1]);

  if (typeof cnote === 'undefined') {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
      return <p>Redirecting...</p>
    }
    return <p>Redirecting...</p>
  }

  if (params.length === 2) {
    return (
      <>
        <Helmet>
          <title>{cnote.title}</title>
        </Helmet>
        <div className="bg-gray-200">
          <div className="rounded-2xl p-4">
            <h1 className="text-2xl font-bold">
              {cnote.title}
            </h1>
            <p className="text-gray-700">
              <b>Last Edited:</b> {dayjs(cnote.lastedit).format('LLL')} • <b>ID:</b> {cnote.id} • <b>User:</b> {cnote.user}
            </p>
          </div>
        </div>
        <div className="bg-white w-full h-full">
          <button onClick={(e) => newBox(e)} className="absolute right-0 lg:m-4">
            <Plus />
          </button>
          <button onClick={(e) => window.location.href = '/'} className="absolute left-0 lg:m-4">
            <X />
          </button>
          {Array.isArray(noteboxes) && noteboxes.length > 0 ? noteboxes.map(notebox => (
            <div className="flex flex-col items-center justify-center h-full">
              <div key={notebox.id} className="w-full max-w-sm m-4 bg-gray-100 shadow-md rounded-2xl">
                <div className="rounded-2xl p-4">
                  <p className="text-gray-700">
                    {notebox.content}
                  </p>
                </div>
              </div>
            </div>
          )) : <div className="p-12">
            <h1 className="text-2xl font-bold">
              No noteboxes yet.
            </h1>
            <p className="text-gray-700">
              Create a new notebox to get started.
            </p>
          </div>}
        </div>
      </>
    )
  } else if (params.length === 1 && typeof window !== 'undefined') {
    window.location.href = '/';
    return
  }

  return <p>Redirecting...</p>
}

export default Note;

export async function getServerSideProps({ req }) {
  const notes = await fetch(`http://localhost:3000/api/notes`, {
    headers: {
      'Cookie': req.headers.cookie
    }
  }).then(res => res.json());

  const noteboxes = await fetch(`http://localhost:3000/api/notebox`, {
    headers: {
      'Cookie': req.headers.cookie,
      'Note' : req.url.substring(req.url.lastIndexOf('/') + 1)
    }
  }).then(res => res.json());

  return { props: { notes, noteboxes } }
}