import { useState } from "react";

export const FetchError = ({ error, statusCode }: { error: string | null, statusCode?: number | null }) => {
  if (!error) {
    return null
  }

  const isAuthError = statusCode && statusCode > 400 && statusCode < 404;

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
  const [value, setValue] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('debugger-token', value);
    } catch (e) {
      console.error('Error saving auth token:', e);
    }
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
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="border-2 text-black px-4 py-2 rounded">
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
