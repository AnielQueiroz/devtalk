import { t } from "i18next";

const InputSearch = () => {
	return (
		<div className="w-full form-control">
			<input
				type="text"
				placeholder={t("search")}
				className="w-full input input-bordered md:w-auto"
			/>
		</div>
	);
};

export default InputSearch;
