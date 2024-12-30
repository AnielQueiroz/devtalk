import { t } from "i18next";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Loading from "./Loading";

const InputSearch = () => {
	const [search, setSearch] = useState("");
	const { searchResults, isSearchLoading, getSearchResults, setSelectedUser, setSelectedCommunity } = useChatStore();

	useEffect(() => {
		if (search.length > 2) getSearchResults(search);
	}, [search, getSearchResults]);

	console.log(searchResults);

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

			{search.length > 2 &&
				((isSearchLoading && (
					<div className="absolute flex justify-center top-full left-0 mt-4 rounded w-72 bg-base-200 p-2 shadow-lg z-10">
						<Loading />
					</div>
				)) ||
					(searchResults?.users.length === 0 &&
						searchResults?.communities.length === 0 && (
							<div className="absolute top-full left-0 mt-4 rounded w-72 bg-base-200 p-2 shadow-lg z-10">
								<p className="text-sm text-base-content text-center">
									{t("noResults")}
								</p>
							</div>
						)) ||
					((searchResults?.users?.length ?? 0) > 0 && (
						<div className="absolute top-full left-0 mt-4 rounded w-72 bg-base-200 p-2 shadow-lg z-10">
							<p className="text-sm text-base-content text-center">
								{t("searchResults")}: {search}
							</p>
							{/* divider */}
							<div className="divider divider-neutral" />

							<div className="space-y-2">
								{searchResults?.users?.map((user) => (
									<button className="w-full" type="button" key={user._id} onClick={() => {setSelectedUser(user); setSearch(""); setSelectedCommunity(null)}}>
										<div
											key={user._id}
											className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary/80 transition-colors"
										>
											<img
												src={user.profilePic || "/avatar.png"}
												alt={user.fullName}
												className="rounded-full size-12 object-cover"
											/>
											<div>
												<p className="font-bold text-base-content">
													{user.fullName}
												</p>
												<p className="badge badge-accent">{t("user")}</p>
											</div>
										</div>
									</button>
								))}
							</div>
						</div>
					)))}
		</div>
	);
};

export default InputSearch;
