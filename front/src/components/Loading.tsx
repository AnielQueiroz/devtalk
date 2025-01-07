const Loading = ({color}: {color?: string}) => {
	return <span className={`loading ${color && `text-${color}`} loading-dots loading-md`} />;
};

export default Loading;
