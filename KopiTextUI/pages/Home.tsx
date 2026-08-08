import { useState, useEffect } from 'react';

interface GenerateResponse {
  id: string;
}

interface ActiveLinksResponse {
  result: string[];
}

const URL = import.meta.env.VITE_API_BACKEND_URL;

export default function Home() {
  const [activeLinks, setActiveLinks] = useState<string[]>([]);
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
    if (!text.trim()) {
      setNotification('Text cant be blank!');
      setIsNotificationVisible(true);
      setTimeout(() => setIsNotificationVisible(false), 3000);
      return
    }
    setLoading(true);

    try {
      const response = await fetch(URL + '/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: text }),
      });
      const data = (await response.json()) as GenerateResponse;
      setShareUrl(`${window.location.origin}/${data.id}`);
      setNotification('Text generated!');
      setIsNotificationVisible(true);
      setTimeout(() => setIsNotificationVisible(false), 3000);
      fetchLinks();
    } catch (error) {
      alert('Failed to generate link!');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async (): Promise<void> => {
    try {
      const response = await fetch(URL + `/api/texts`);
      if (response.status === 404) {
        setNotification('There is no active link!');
        setIsNotificationVisible(true);
        setTimeout(() => setIsNotificationVisible(false), 3000);
        return;
      }
      const data = (await response.json()) as ActiveLinksResponse;
      setActiveLinks(data.result);
    } catch (error) {
      setNotification('Data not found!');
      setIsNotificationVisible(true);
      setTimeout(() => setIsNotificationVisible(false), 3000);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 font-sans overflow-hidden">

      {/* --- SIDEBAR KIRI --- */}
      <div className="w-72 border-r border-zinc-800 bg-zinc-950/50 p-4 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-1">
          Active Links
        </h2>

        <div className="flex flex-col space-y-2">
          {activeLinks.map((link, index) => (
            <button
              key={index}
              className="w-full text-left p-3 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
              onClick={() => {
                window.open(link)
              }}
            >
              <p className="text-sm font-medium text-white truncate">Link {index + 1}</p>
              <p className="text-xs text-zinc-400 truncate mt-1 group-hover:text-zinc-300">kopitext.com/{link}</p>
            </button>
          ))}
          {activeLinks.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-4">
              Belum ada link yang aktif
            </p>
          )}
        </div>
      </div>

      {/* --- AREA UTAMA (TENGAH) --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 h-full overflow-y-auto relative">
        <div className="w-full max-w-4xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            KopiText
          </h1>

          <textarea
            className="w-full h-64 p-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none text-zinc-300 placeholder-zinc-500"
            placeholder="Write something here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={async () => {
              try {
                await handleGenerate();
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
              <div className="flex space-x-2 shrink-0">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      showNotification("Text successfully copied!");
                    } catch (error) {
                      showNotification("Failed to copy text!");
                    }
                  }}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors text-white cursor-pointer"
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
      </div>
      {/* Toast */}
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
  )
}

