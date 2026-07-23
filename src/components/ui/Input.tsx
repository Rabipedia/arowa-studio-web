// type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// export default function Input({className="", ...props}: InputProps) {
//     return(
//         <input
//             className={`w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none${className}`}
//             {...props}
//         />
//     )
// }   
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
            {...props}
        />
    );
}