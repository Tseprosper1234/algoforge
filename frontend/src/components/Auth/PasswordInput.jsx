import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, placeholder, required = true, id }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                id={id}
                style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                }}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '5px',
                    color: 'var(--text-secondary)'
                }}
            >
                {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
        </div>
    );
};

export default PasswordInput;
