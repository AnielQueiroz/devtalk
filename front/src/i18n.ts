import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// translates
const resources = {
	pt: {
		translation: {
			welcome: "Bem vindo de volta",
			welcomeMessage: "Entre com sua conta para continuar",
			createAccount: "Criar conta",
			createAccountMessage: "Crie uma conta para continuar",
			fillName: "Preencha o nome",
			infoProfile: "Informações do perfil",
			fillEmail: "Preencha o email",
			invalidEmail: "Email inválido",
			fillPassword: "Preencha a senha",
			lengthPassword: "A senha precisa ter pelo menos 6 caracteres",
			profile: "Perfil",
			search: "Buscar...",
			altProfile: "Ícone de perfil",
			setting: "Configurações",
			login: "Entrar",
			signup: "Cadastrar",
			logout: "Sair",
			name: "Nome",
			phName: "Digite seu nome",
			password: "Senha",
			email: "Email",
			phEmail: "Digite seu email",
			noAccount: "Não tem uma conta?",
			haveAccount: "Já tem uma conta?",
			signupHere: "Cadastre-se",
			joinCommunity: "Junte-se a comunidade",
			joinCommunityMessage:
				"Faça parte da nossa comunidade e compartilhe conhecimento com outros desenvolvedores.",
			language: "Idioma",
			successCreateAccount: "Conta criada com sucesso!",
			successLogin: "Login realizado com sucesso!",
			successLogout: "Logout realizado com sucesso!",
			successProfileUpdate: "Perfil atualizado com sucesso!",
			updating: "Atualizando...",
			clickUpdatePic: "Clique no ícone para atualizar",
			accountInfo: "Informações da conta",
			memberSince: "Membro desde",
			lastUpdate: "Última atualização",
			accountStatus: "Status da conta",
			errorProfilePicTooLarge: "Foto de perfil muito grande, tamanho máximo: 3MB",
			unexpectedError: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
			previewMsg1: "Olá! Tudo bem?",
			previewMsg2: "Eai, estou bem haha!",
			theme: "Tema",
			chooseTheme: "Escolha um tema",
		},
	},
	en: {
		translation: {
			welcome: "Welcome back",
			welcomeMessage: "Login to continue",
			createAccount: "Create account",
			createAccountMessage: "Create an account to continue",
			fillName: "Fill the name",
			infoProfile: "Profile information",
			fillEmail: "Fill the email",
			invalidEmail: "Invalid email",
			fillPassword: "Fill the password",
			lengthPassword: "The password must have at least 6 characters",
			profile: "Profile",
			altProfile: "Profile icon",
			search: "Search...",
			setting: "Settings",
			login: "Login",
			signup: "Signup",
			logout: "Logout",
			name: "Name",
			phName: "Type your name",
			password: "Password",
			email: "Email",
			phEmail: "Type your email",
			noAccount: "Don't have an account?",
			haveAccount: "Already have an account?",
			signupHere: "Signup here",
			joinCommunity: "Join the community",
			joinCommunityMessage:
				"Join our community and share knowledge with other developers.",
			language: "Language",
			successCreateAccount: "Account created successfully!",
			successLogin: "Login successfully!",
			successLogout: "Logout successfully!",
			successProfileUpdate: "Profile updated successfully!",
			updating: "Updating...",
			clickUpdatePic: "Click on the icon to update",
			accountInfo: "Account information",
			memberSince: "Member since",
			lastUpdate: "Last update",
			accountStatus: "Account status",
			errorProfilePicTooLarge: "Profile picture too large, maximum size: 3MB",
			unexpectedError: "An unexpected error occurred. Try again later.",
			previewMsg1: "Hi! How are you?",
			previewMsg2: "Hey, I'm fine haha!",
			theme: "Theme",
			chooseTheme: "Choose a theme",
		},
	},
	ja: {
		translation: {
			welcome: "お帰りなさい",
			welcomeMessage: "続けるにはアカウントでログインしてください",
			createAccount: "アカウントを作成",
			createAccountMessage: "続けるにはアカウントを作成してください",
			profile: "プロフィール",
			setting: "設定",
			login: "ログイン",
			signup: "登録",
			logout: "ログアウト",
			name: "名前",
			password: "パスワード",
			email: "メール",
			noAccount: "アカウントをお持ちでないですか？",
			haveAccount: "すでにアカウントをお持ちですか？",
			signupHere: "こちらで登録",
			joinCommunity: "コミュニティに参加",
			joinCommunityMessage:
				"私たちのコミュニティに参加して、他の開発者と知識を共有しましょう。",
			language: "言語",
		},
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "pt",
	fallbackLng: "pt",
	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
