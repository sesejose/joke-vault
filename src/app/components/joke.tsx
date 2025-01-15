export default function Joke({ text, id }) {
  return (
    <>
      <div>
        <li className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">{text}</p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">Joke ID: {id}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-gray-900">
              <button>Listen</button>
            </p>
            <p className="mt-1 text-xs/5 text-gray-500">Lyd</p>
          </div>
        </li>
        {/* This is a Joke: {text} with the id: {id} */}
      </div>
    </>
  );
}
