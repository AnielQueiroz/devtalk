import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
	const { authUser, isUpdatingProfile } = useAuthStore();

  console.log(authUser?.updatedAt);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
	};

	return (
		<div className="pt-20">
			<div className="max-w-2xl mx-auto p-4 py-6">
				<div className="bg-base-300 rounded-xl p-6 space-y-8">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Perfil</h1>
						<p className="mt-2">Suas informações de perfil</p>
					</div>

					{/* avatar */}
					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<img
								src={authUser?.profilePic || "/avatar.png"}
								alt="Foto de perfil"
								className="size-32 rounded-full object-cover border"
							/>
							<label
								htmlFor="avatar-upload"
								className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
							>
								<Camera className="w-5 h-5 text-base-200" />
								<input
									type="file"
									id="avatar-upload"
									className="hidden"
									accept="image/*"
									onChange={handleImageUpload}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Atualizando..." : "Clique no ícone para atualizar"}
            </p>
					</div>

          {/* user infos */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Nome completo
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* other infos */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">
              Informações da conta
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Membro desde</span>
                <span>{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Última atualização</span>
                <span>{authUser?.updatedAt ? new Date(authUser.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Status da conta</span>
                <span className="text-green-500">Online</span>
              </div>
            </div>
          </div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
