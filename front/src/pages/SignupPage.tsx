import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import Loading from "../components/Loading";
import { useTranslation } from "react-i18next";

const SignupPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState([
		{ email: "", fullName: "", password: "" },
	]);

	const { t } = useTranslation();

	const { signUp, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData[0].fullName.trim()) return toast.error(t('fillName'));
		if (!formData[0].email.trim()) return toast.error(t('fillEmail'));
		if (!/\S+@\S+\.\S+/.test(formData[0].email))
			return toast.error(t('invalidEmail'));
		if (!formData[0].password) return toast.error(t('fillPassword'));
		if (formData[0].password.length < 6)
			return toast.error(t('lengthPassword'));

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const success = validateForm();

		if (success === true) signUp(formData[0], t);
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* left side */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/*  logo */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<Logo />
							<h1 className="text-xl font-bold mt-2">{t("createAccount")}</h1>
							<p className="text-base-content/60">
								{t("createAccountMessage")}
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label" htmlFor="fullName">
								<span className="label-text font-medium">{t("name")}</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="size-5 text-base-content/40" />
								</div>
								<input
									id="fullName"
									type="text"
									name="fullName"
									placeholder={t('phName')}
									value={formData[0].fullName}
									className="input input-bordered w-full pl-10"
									onChange={(e) => {
										const updatedFormData = [...formData];
										updatedFormData[0].fullName = e.target.value;
										setFormData(updatedFormData);
									}}
								/>
							</div>
						</div>
						<div className="form-control">
							<label className="label" htmlFor="email">
								<span className="label-text font-medium">{t("email")}</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40" />
								</div>
								<input
									id="email"
									type="email"
									name="email"
									placeholder={t('phEmail')}
									value={formData[0].email}
									className="input input-bordered w-full pl-10"
									onChange={(e) => {
										const updatedFormData = [...formData];
										updatedFormData[0].email = e.target.value;
										setFormData(updatedFormData);
									}}
								/>
							</div>
						</div>
						<div className="form-control">
							<label className="label" htmlFor="password">
								<span className="label-text font-medium">{t("password")}</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40" />
								</div>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="******"
									value={formData[0].password}
									className="input input-bordered w-full pl-10"
									onChange={(e) => {
										const updatedFormData = [...formData];
										updatedFormData[0].password = e.target.value;
										setFormData(updatedFormData);
									}}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-secondary w-full"
							disabled={isSigningUp}
						>
							{isSigningUp ? <Loading /> : <>{t("signup")}</>}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							{t("haveAccount")}{" "}
							<Link to="/login" className="link">
								{t("login")}
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* right side */}
			<AuthImagePattern
				title={t("joinCommunity")}
				subTitle={t("joinCommunityMessage")}
			/>
		</div>
	);
};

export default SignupPage;
