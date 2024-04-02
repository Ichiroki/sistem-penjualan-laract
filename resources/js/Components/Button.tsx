function Button({
    color = "light",
    disabled = false,
    children,
    ...props
}) {

    let colorClass = ''
    if(color === "light") {
        colorClass = "w-[4.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-slate-600 enabled:hover:text-white enabled:hover:bg-slate-600"
    } else if (color === "primary") {
        colorClass = "w-[4.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-blue-500 enabled:hover:text-white enabled:hover:bg-blue-500"
    } else if (color === "danger") {
        colorClass = "w-[4.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-rose-500 enabled:hover:text-white enabled:hover:bg-rose-500"
    } else if (color === "success") {
        colorClass = "w-[4.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-green-500 enabled:hover:text-white enabled:hover:bg-green-500"
    } else if (color === "warning") {
        colorClass = "w-[4.5rem] h-[2.5rem] transition-all duration-[0.3s] enabled:cursor-pointer font-[550] rounded-xl border-2 border-solid border-yellow-500 enabled:hover:text-white enabled:hover:bg-yellow-500"
    }

    return (
        <button
        {...props}
        className={colorClass}
        disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
