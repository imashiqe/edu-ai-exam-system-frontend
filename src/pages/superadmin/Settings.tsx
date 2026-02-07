import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function Settings() {
  const [provider, setProvider] = useState("GEMINI");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/settings");
        setProvider(res.data.settings.aiDefaultProvider);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load settings");
      }
    })();
  }, []);

  const save = async () => {
    setErr(null);
    setOk(null);
    try {
      await api.put("/admin/settings", { aiDefaultProvider: provider });
      setOk("Saved successfully.");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Save failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Default AI provider configuration."
      />
      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <label className="form-label">Default AI Provider</label>
          <select
            className="form-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="OPENAI">ChatGPT (OpenAI)</option>
            <option value="GEMINI">Gemini</option>
            <option value="NONE">None</option>
          </select>
          <button className="btn btn-primary mt-3" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
