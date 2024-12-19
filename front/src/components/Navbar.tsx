import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import Themes from "./Themes";

const Navbar = () => {
	const { authUser, logout } = useAuthStore();

	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<div className="flex gap-2 items-center">
					<MessagesSquare className="size-6" />
					<a href="/" className="text-xl font-bold">
						devTalk
					</a>
				</div>
			</div>
			<Themes />
			{authUser && (
				<div className="flex-none gap-2">
					<div className="form-control">
						<input
							type="text"
							placeholder="Buscar..."
							className="input input-bordered w-24 md:w-auto"
						/>
					</div>
					<div className="dropdown dropdown-end">
						<button
							tabIndex={0}
							type="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full">
								<img
									alt="Foto de perfil"
									src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
								/>
							</div>
						</button>
						<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow space-y-2">
							<li className="flex items-center gap-2 transition-colors pointer-events-none">
								{/* <span className="hidden sm:inline">Menu</span> */}
							</li>
							<Link
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								to={"/profile"}
							>
								<User className="size-5" />
								<span className="hidden sm:inline">Perfil</span>
							</Link>
							<Link
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								to={"/settings"}
							>
								<Settings className="size-5" />
								<span className="hidden sm:inline">Configurações</span>
							</Link>
							<button
								className="flex items-center gap-2 transition-colors-hover hover:text-primary"
								type="button"
								onClick={logout}
							>
								<LogOut className="size-5" />
								<span className="hidden sm:inline">Sair</span>
							</button>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
