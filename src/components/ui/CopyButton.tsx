export default function CopyButton({ text }: { text: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };
  return (
    <button className="btn btn-outline-primary btn-sm" onClick={copy}>
      Copy
    </button>
  );
}
