import { useEffect, useState } from "react";
import "./App.scss";
import { Switch } from "./components/Switch";
import { DEFAULT_REDIRECT_URL, KEYS, Storage } from "./constants";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [activated, setActivated] = useState<Storage["ACTIVATED"]>(true);
  const [blockUrls, setBlockUrls] = useState<Storage["BLOCK_URLS"]>([]);
  const [redirectUrl, setRedirectUrl] = useState<Storage["REDIRECT_URL"]>("");
  const [savedRedirectUrl, setSavedRedirectUrl] =
    useState<Storage["REDIRECT_URL"]>("");

  const [url, setUrl] = useState("");

  useEffect(() => {
    const init = async () => {
      const { activated, blockUrls, redirectUrl } =
        await chrome.storage.sync.get([
          KEYS.ACTIVATED,
          KEYS.BLOCK_URLS,
          KEYS.REDIRECT_URL,
        ]);
      setActivated(activated ?? true);
      setBlockUrls(blockUrls ?? []);
      setRedirectUrl(redirectUrl ?? DEFAULT_REDIRECT_URL);
      setSavedRedirectUrl(redirectUrl ?? DEFAULT_REDIRECT_URL);
      setInitialized(true);

      const data: Partial<Storage> = {};
      if (!activated) data.ACTIVATED = true;
      if (!blockUrls) data.BLOCK_URLS = [];
      if (!redirectUrl) data.REDIRECT_URL = DEFAULT_REDIRECT_URL;
      if (Object.keys(data).length) {
        await chrome.storage.sync.set(data);
      }
    };
    init();
  }, []);

  if (!initialized) {
    return <div>loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Block the sites</h2>
        <Switch
          value={activated}
          onClick={async () => {
            const next = !activated;
            await chrome.storage.sync.set({ [KEYS.ACTIVATED]: next });
            setActivated(next);
          }}
        />
      </div>

      <hr />

      <section>
        <h2>block URLs</h2>
        {blockUrls.map((url, i) => {
          return (
            <div key={i} className="inputContainer">
              <input placeholder="https://example.com" value={url} disabled />
              <button
                onClick={async () => {
                  const next = blockUrls.filter((blockUrl) => blockUrl !== url);
                  await chrome.storage.sync.set({ blockUrls: next });
                  setBlockUrls(next);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        <div className="inputContainer">
          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!url) return;
              const next = [...blockUrls, url];
              await chrome.storage.sync.set({ [KEYS.BLOCK_URLS]: next });
              setBlockUrls(next);
              setUrl("");
            }}
          >
            add
          </button>
        </div>
      </section>

      <section>
        <h2>redirect URL</h2>
        <div className="inputContainer">
          <input
            placeholder="https://example.com"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
          <button
            disabled={!redirectUrl.length || redirectUrl === savedRedirectUrl}
            onClick={async () => {
              await chrome.storage.sync.set({
                [KEYS.REDIRECT_URL]: redirectUrl,
              });
              setSavedRedirectUrl(redirectUrl);
            }}
          >
            save
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
