type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props}: ButtonProps) {
    return(
        <button
         className={`rounded bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-300 ${className}`}
         {...props}
        />
    );
}