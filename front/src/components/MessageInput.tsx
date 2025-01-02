import type React from "react";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, X, Image } from "lucide-react";
import { t } from "i18next";
import toast from "react-hot-toast";


const MessageInput = () => {
	const [text, setText] = useState("");
	const [imgPreview, setImgPreview] = useState<string | ArrayBuffer | null>(
		null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChatStore();

  // 🖼️ Seleção de Imagem
	const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const files = e.target.files;
		if (!files) return;
		const file = files[0];

		if (!file.type.startsWith("image/")) {
			toast.error(t("selectAImageFile"));
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setImgPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	// 🗑️ Remover Imagem
  const removeImg = () => {
		setImgPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	// 📨 Enviar Mensagem
  const handleSendMsg = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!text.trim() && !imgPreview) return;
		try {
			await sendMessage({
				text: text.trim(),
				image: imgPreview,
			});

			setText("");
			setImgPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
      if (textAreaRef.current) textAreaRef.current.style.height = "auto";
		} catch (error) {
			console.log("Erro ao enviar mensagem", error);
		}
	};

  // ↕️ Ajustar a altura do textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // Ajuste dinâmico da altura do textarea
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      if (textAreaRef.current.scrollHeight < 116) {
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      } else {
        textAreaRef.current.style.height = "116px";
        textAreaRef.current.style.overflowY = "auto";
      }
    }
  };

  // 📚 Lógica para Enter e Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMsg(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

	return (
		<div className="p-4 w-full bg-base-200">
			{imgPreview && (
				<div className="mb-3 flex items-center gap-2">
					<div className="relative">
						<img
							src={typeof imgPreview === "string" ? imgPreview : undefined}
							alt="Preview"
							className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
						/>
						<button
							onClick={removeImg}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
							type="button"
						>
							<X className="size-3" />
						</button>
					</div>
				</div>
			)}

			{/* Area de Texto e Botoes */}
      <form onSubmit={handleSendMsg} className="flex items-center gap-2">
				<div className="flex-1 flex gap-2">
					<textarea
            ref={textAreaRef}
						className="w-full textarea textarea-bordered rounded-lg textarea-sm sm:textarea-md"
						placeholder={t("phTypeMessage")}
						value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ maxHeight: "116px" }}
					/>
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleImgSelect}
					/>
				</div>
				<button
					type="button"
					className={`sm:flex btn btn-circle
                   ${imgPreview ? "text-emerald-500" : "text-zinc-400"}`}
					onClick={() => fileInputRef.current?.click()}
				>
					<Image size={20} />
				</button>

				<button
					type="submit"
					className="btn bg-primary hover:bg-primary/65 btn-circle"
					disabled={!text.trim() && !imgPreview}
				>
					<Send size={20} />
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
