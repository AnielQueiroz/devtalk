import { useAuthStore } from "../store/useAuthStore";
import {
	Languages,
	LogOut,
	MessagesSquare,
	Settings,
	User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";
import i18n from "../i18n";
import { useThemeStore } from "../store/useThemeStore";
import InputSearch from "./InputSearch";

const Navbar = () => {
	const { authUser, logout } = useAuthStore();
	const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] =
		useState(false);

  const { setLanguage } = useThemeStore();

	const toggleLanguageDropdown = () => {
		setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
	};

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    toggleLanguageDropdown()
    setLanguage(lng);
  };

	const { t } = useTranslation();

	return (
		<div className="fixed z-50 navbar flex flex-col sm:flex-row bg-base-300 sm:justify-between shadow-xl">
			<div className="sm:w-auto flex justify-center sm:justify-between items-start">
				<div className="flex gap-2 items-center py-2">
					<MessagesSquare className="size-6" />
					<Link to={"/"} className="text-xl font-bold">
						devTalk
					</Link>
				</div>
			</div>
			{authUser && (
				<div className="w-full sm:w-auto flex-none gap-2">
					<InputSearch />
					<div className="dropdown dropdown-end">
						<button
							tabIndex={0}
							type="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full">
								<img
									alt={t("altProfile")}
									src={authUser.profilePic || "/avatar.png"}
								/>
							</div>
						</button>
						<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 px-8 shadow space-y-2">
							<li className="flex items-center gap-2 transition-colors pointer-events-none">
								{/* <span className="hidden sm:inline">Menu</span> */}
							</li>
							<Link
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								to={"/profile"}
							>
								<User className="size-5" />
								<span className="sm:inline">{t("profile")}</span>
							</Link>
							<Link
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								to={"/theme"}
							>
								<Settings className="size-5" />
								<span className="sm:inline">{t("theme")}</span>
							</Link>
							<div className="dropdown dropdown-bottom dropdown-end">
								<button
									type="button"
									className="flex items-center gap-2 transition-colors-hover hover:text-primary"
									onClick={toggleLanguageDropdown}
								>
									<Languages className="size-5" />
									<span>{t("language")}</span>
								</button>
								{isLanguageDropdownVisible && (
									<ul className="dropdown-content menu bg-base-200 rounded-box z-[1] p-2 px-6 shadow">
										<li>
											<button
												type="button"
												onClick={() => changeLanguage("pt")}
											>
												pt
											</button>
										</li>
										<li>
											<button
												type="button"
												onClick={() => changeLanguage("en")}
											>
												en
											</button>
										</li>
									</ul>
								)}
							</div>
							<button
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								type="button"
								onClick={() => logout(t)}
							>
								<LogOut className="size-5" />
								<span className="sm:inline">{t("logout")}</span>
							</button>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
