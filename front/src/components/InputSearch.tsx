import { t } from "i18next";
import { useState } from "react";

const InputSearch = () => {
	const [search, setSearch] = useState("");

	if (search.length > 3) {
		console.log(search);
		// logica para fazer a busca
	}

	return (
		<div className="relative w-72">
			<label className="input input-bordered flex items-center gap-2 w-full">
				<input
					type="text"
					className="grow"
					placeholder={t("search")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="h-4 w-4 opacity-70"
				>
					<title>{t("search")}</title>
					<path
						fillRule="evenodd"
						d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
						clipRule="evenodd"
					/>
				</svg>
			</label>

            {search.length > 3 && (
                <div className="absolute top-full left-0 mt-4 rounded w-72 bg-base-200 p-2 shadow-lg z-10">
                    <p className="text-sm text-base-content text-center">{t("searchResults")}: {search}</p>
                    {/* divider */}
                    <div className="divider divider-secondary" />

                    {/* exemplo de resultado de busca, cards com foto, nome e badge para indicar se é usuário ou comunidade */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary/80 transition-colors">
                            <img
                                src="https://i.pravatar.cc/150?img=3"
                                alt="avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-base-content">Só Java</p>
                                <p className="badge badge-primary">Comunidade</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary/80 transition-colors">
                            <img
                                src="https://i.pravatar.cc/150?img=3"
                                alt="avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-base-content">Romeu</p>
                                <p className="badge badge-accent">Usuário</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
		</div>
	);
};

export default InputSearch;
