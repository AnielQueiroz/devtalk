import { t } from "i18next";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useCommunityStore } from "../store/useCommunityStore";
import Loading from "./Loading";

interface User {
  _id: string;
  fullName: string;
  name?: string;
  email: string;
  profilePic?: string;
  photoUrl?: string;
}

interface Community {
  _id: string;
  name: string;
  fullName?: string;
  description?: string | undefined;
  photoUrl?: string | undefined;
  profilePic?: string;
  isPublic: boolean;
  tags: Record<string, string>[] | undefined;
  creatorId: Record<string, string>;
  createdAt: string;
}

interface SearchResultsProps {
  results: (User | Community)[] | null;
  onSelect: (item: User | Community) => void;
  type: "user" | "community";
}

const SearchResults = ({ results, onSelect, type }: SearchResultsProps) => (
  <div className="space-y-2">
    {results?.map((item: User | Community) => (
      <button
        key={item._id}
        className="w-full"
        type="button"
        onClick={() => onSelect(item)}
      >
        <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-primary/80 transition-colors">
          <img
            src={item.profilePic || item.photoUrl || "/avatar.png"}
            alt={item.fullName || item.name}
            className="rounded-full size-12 object-cover"
          />
          <div>
            <p className="font-bold text-base-content">
              {item.fullName || item.name}
            </p>
            <p className="badge badge-accent">{t(type)}</p>
          </div>
        </div>
      </button>
    ))}
  </div>
);

const InputSearch = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"user" | "community">("user");

  const {
    usersResults,
    isSearchLoading,
    getUsersResults,
    setSelectedUser,
    setUsersResults,
  } = useChatStore();

  const { communities, setCommunities, getCommunities, setSelectedCommunity, isCommunitiesLoading } = useCommunityStore();

  useEffect(() => {
    if (search.length > 2) {
      selectedCategory === "user" ? getUsersResults(search) : getCommunities(search);
    }
  }, [search, getUsersResults, getCommunities, selectedCategory]);

  const showResults = search.length > 2;
  const isSearchingAnything = isSearchLoading || isCommunitiesLoading;

  const handleSelectItem = (item: User | Community) => {
    if (selectedCategory === "user") {
      setSelectedUser(item as User);
      setSelectedCommunity(null);
    } else {
      setSelectedUser(null);
	  setSelectedCommunity(item as Community);
    }
    setSearch("");
  };

  const handleSelectRadio = (category: "user" | "community") => {
    setSelectedCategory(category);
    if (category === "user") setCommunities(undefined);
    if (category === "community") setUsersResults(null);
  };

  return (
    <div className="relative w-72">
      {/* Input e Categorias */}
      <label className="input input-bordered flex items-center gap-4">
        <div className="dropdown dropdown-hover">
          <div className="p-2">{t(selectedCategory)}:</div>
          <div className="dropdown-content flex flex-col menu bg-base-100 rounded-box w-40 z-[1] p-2 shadow">
            {["user", "community"].map((category) => (
              <label
                key={category}
                className="w-full flex justify-between items-center gap-2 p-2"
              >
                <span>{t(category)}</span>
                <input
                  type="radio"
                  name="radio-category"
                  className="radio radio-primary"
                  onClick={() => handleSelectRadio(category as "user" | "community")}
                  defaultChecked={selectedCategory === category}
                />
              </label>
            ))}
          </div>
        </div>
        <input
          type="text"
          className="grow p-2"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {/* Resultados */}
      {showResults && (
        <div className="absolute top-full left-0 mt-4 rounded w-72 bg-base-200 p-2 shadow-lg z-10">
          {isSearchingAnything ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : usersResults?.length === 0 && communities?.length === 0 ? (
            <p className="text-sm text-base-content text-center">
              {t("noResults")}
            </p>
          ) : (
            <>
              <p className="text-sm text-base-content text-center mb-2">
                {t("searchResults")}: {search}
              </p>
              <div className="divider divider-neutral" />
              <SearchResults
                results={selectedCategory === "user" ? usersResults : communities}
                onSelect={handleSelectItem}
                type={selectedCategory}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSearch;
