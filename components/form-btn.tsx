interface FromButtonProps {
	loading: boolean;
	text: string;
}
export default function FromButton({loading, text}:FromButtonProps){
	return(
		<button disabled={loading} className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed">{loading? "로딩 중" : text}</button>
	);
}