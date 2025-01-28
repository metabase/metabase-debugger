import { useState } from "react";

export const FetchError = ({ error }: { error: string}) => {
  if (!error) {
    return null
  }

  const isAuthError = error?.toLowerCase()?.includes('unauthorized');

  return (
    <div className="flex items-center justify-center p-12">
      <p className="text-red-500">{error}</p>
      {isAuthError && <AuthButton />}
    </div>
  )
}

const AuthButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={()=> setShowModal(true)}
        className="hover:text-blue-800 text-gray-600 font-bold py-1 px-2 rounded mx-3"
      >
        Set auth token
      </button>
      {showModal && <AuthModal onClose={() => setShowModal(false)} /> }
    </>
  );
}

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-expect-error - react doesn't know about form target keys
    localStorage.setItem('debugger-token', e.target?.['auth-token'].value);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form className="bg-white p-8 rounded-lg w-96" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-lg mb-4">Enter your auth token</h2>
          <input
            type="password"
            placeholder="Auth token"
            name="auth-token"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />

        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="border-2 text-black px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" className="border-2 border-blue-500 bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
