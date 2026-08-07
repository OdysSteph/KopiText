import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';

interface ViewResponse {
  result: string;
}

export default function View() {
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState<string>('Loading...');
  const [notification, setNotification] = useState<string>('');
  const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false)

  const showNotification = (message: string) => {
    setNotification(message);
    setIsNotificationVisible(true);
    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 1800);
    setTimeout(() => {
      setNotification("");
    }, 2000);
  }

  useEffect(() => {
    const fetchText = async (): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:8080/api/texts/${id}`);
        if (response.status === 404) {
          setText('Teks tidak ditemukan atau sudah kadaluarsa.');
          return;
        }
        const data = (await response.json()) as ViewResponse;
        setText(data.result);
      } catch (error) {
        setText('Gagal mengambil data dari server.');
      }
    };

    if (id) {
      fetchText();
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4 font-sans">
      <div className="w-full max-w-6xl space-y-4">

        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            KopiText ~ {id}
          </h1>
          <div className="flex justify-between">
            <button
              onClick={() => window.open("/")}
              className="px-4 py-2 mr-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors text-white cursor-pointer"
            >
              Create new text
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text);
                  showNotification("Copied to clipboard!");
                } catch (error) {
                  showNotification("Failed to copy text!");
                }
              }}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors text-white cursor-pointer"
            >
              <Copy />
            </button>
          </div>
        </div>

        <textarea
          className="w-full h-64 p-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none text-zinc-300 placeholder-zinc-500"
          value={text}
          readOnly
        />
      </div>

      <div
        className={`
    fixed top-5 right-5
    bg-zinc-800
    text-white
    px-4 py-3
    rounded-lg
    shadow-lg
    border border-zinc-700
    z-50
    transition-all duration-500 ease-in-out
    ${isNotificationVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
          }
  `}
      >
        {notification}
      </div>
    </div>
  );
}