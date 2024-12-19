import i18n from "../i18n";

const Language = () => {
	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};
	return (
		<select
			className="select select-bordered absolute top-4 right-4 px-4"
			onChange={(e) => changeLanguage(e.target.value)}
		>
			<option>pt</option>
			<option>en</option>
			{/* <option>ja</option> */}
		</select>
	);
};

export default Language;
