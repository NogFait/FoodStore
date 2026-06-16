import { useRef, useState } from "react";
import { uploadImage, deleteImage } from "../../services/uploadService";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type MultipleProps = {
  mode: "multiple";
  urls: string[];
  onChange: (urls: string[]) => void;
};

type SingleProps = {
  mode: "single";
  url: string;
  onChange: (url: string) => void;
};

type SharedImageUploaderProps = MultipleProps | SingleProps;

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function SharedImageUploader(props: SharedImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMultiple = props.mode === "multiple";
  const currentUrls = isMultiple ? props.urls : (props.url ? [props.url] : []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Tipo no permitido: ${file.type}. Usá JPG, PNG, WebP o GIF.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" supera los ${MAX_SIZE_MB} MB.`);
        continue;
      }

      setUploading(true);
      try {
        const result = await uploadImage(file);
        if (isMultiple) {
          props.onChange([...props.urls, result.url]);
        } else {
          props.onChange(result.url);
        }
      } catch {
        setError("Error al subir la imagen. Intentá de nuevo.");
      } finally {
        setUploading(false);
      }
    }
  }

  async function handleRemove(url: string) {
    const publicId = extractPublicId(url);
    if (publicId) {
      deleteImage(publicId).catch(() => {});
    }
    if (isMultiple) {
      props.onChange(props.urls.filter((u) => u !== url));
    } else {
      props.onChange("");
    }
  }

  return (
    <div className="space-y-3">
      {currentUrls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {currentUrls.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3EError%3C/text%3E%3C/svg%3E";
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title="Eliminar imagen"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Subiendo...</span>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-8 w-8 text-gray-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="text-indigo-600 font-medium">Clic para subir</span> o arrastrá acá
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP, GIF — máx. {MAX_SIZE_MB} MB</p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple={isMultiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
