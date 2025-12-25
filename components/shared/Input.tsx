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
                className="w-full px-4 py-2 sm:px-4 sm:py-2.5 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-gray-500"
                style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid var(--primary-400)',
                    color: 'var(--neutral-900)'
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-600)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)'
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-400)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            />
            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}
