/**
 * Shared Input Component
 * Reusable text input used across all portals
 * Wireframe style with responsive sizing
 */

interface InputProps {
    label?: string
    type?: 'text' | 'email' | 'password' | 'tel' | 'number'
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
    error?: string
}

export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 border-2 border-gray-400 rounded focus:outline-none focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}
