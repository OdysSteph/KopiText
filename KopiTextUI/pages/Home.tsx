import { useState } from 'react';

interface GenerateResponse {
  id: string;
}

export default function Home() {
  const [text, setText] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleGenerate = async (): Promise<void> => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: text }),
      });

      const data = (await response.json()) as GenerateResponse;
      setShareUrl(`${window.location.origin}/${data.id}`);
    } catch (error) {
      alert('Gagal nyambung ke server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4 font-sans">
      <div className="w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          KopiText
        </h1>

        <textarea
          className="w-full h-64 p-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none text-zinc-300 placeholder-zinc-500"
          placeholder="Ketik sesuatu di sini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={async () => {
            try {
              await handleGenerate();
              showNotification("Text generated!");
            } catch (error) {
              showNotification("Failed to generate text!");
            }
          }}
          disabled={loading}
          className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </button>

        {shareUrl && (
          <div className="p-4 bg-zinc-800 rounded-lg flex items-center justify-between mt-4 border border-zinc-700">
            <span className="truncate mr-4 text-zinc-300">{shareUrl}</span>
            <div className="flex justify-around">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    showNotification("Text successfully copied!");
                  } catch (error) {
                    showNotification("Failed to copied text!");
                  }
                }}
                className="px-4 mr-2 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors text-white cursor-pointer"
              >
                Copy Link
              </button>
              <button
                onClick={() => window.open(shareUrl)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors text-white cursor-pointer"
              >
                Open Link
              </button>
            </div>

          </div>
        )}
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