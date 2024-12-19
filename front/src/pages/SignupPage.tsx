import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import Loading from "../components/Loading";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState([
    { email: "", fullName: "", password: "" },
  ]);

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData[0].fullName.trim()) return toast.error("Preencha o nome!");
    if (!formData[0].email.trim()) return toast.error("Preencha o email!");
    if (!/\S+@\S+\.\S+/.test(formData[0].email))
      return toast.error("Email inválido!");
    if (!formData[0].password) return toast.error("Preencha a senha!");
    if (formData[0].password.length < 6)
      return toast.error("A senha precisa ter pelo menos 6 caracteres!");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signUp(formData[0]);
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
              <h1 className="text-xl font-bold mt-2">Criar conta</h1>
              <p className="text-base-content/60">
                Crie uma conta para continuar
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label" htmlFor="fullName">
                <span className="label-text font-medium">Nome completo</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Digite seu nome completo"
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
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Digite seu email"
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
                <span className="label-text font-medium">Senha</span>
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
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? <Loading /> : "Cadastrar"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Já possui uma conta?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Junte se à comunidade"
        subTitle="Faça parte da nossa comunidade e compartilhe conhecimento com outros desenvolvedores."
      />
    </div>
  );
};

export default SignupPage;
