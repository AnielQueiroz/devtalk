const Themes = () => {
	return (
		<div className="dropdown">
			<button type="button" tabIndex={0} className="btn m-1">
				Temas
				<svg
					width="12px"
					height="12px"
					className="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<title>Menu de temas</title>
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
				</svg>
			</button>
			<ul className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Synthwave"
						value="synthwave"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Retro"
						value="retro"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Black"
						value="black"
					/>
				</li>
			</ul>
		</div>
	);
};

export default Themes;
