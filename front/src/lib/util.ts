export function formatMessageTime(date: Date) {
	return new Date(date).toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

export function isCodeMessage(text: string) {
    const textFormatted = text.trim().replace(/\s/g, '\u00A0');
	// Verifica se há blocos de código (```), tags HTML/JSX ou padrões comuns de código
	return (
		textFormatted.startsWith("```") || // Blocos de código markdown
		/(?:\n|^)```/.test(textFormatted) || // Blocos de código multiline
		/<[a-z][\s\S]*?>.*<\/[a-z][\s\S]*?>/i.test(textFormatted) || // Tags HTML/JSX
		/=[^=]/.test(textFormatted) || // Atribuições
		textFormatted.includes(";") || // Ponto e vírgula (comum em código)
		/\b(function|const|let|var|return|if|else|for|while|switch)\b/.test(text) // Palavras-chave comuns de código
	);
}
