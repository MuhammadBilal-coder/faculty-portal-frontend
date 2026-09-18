import { useEffect, useRef, useState } from 'react';

export function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button type="button" className="dropdown-trigger" onClick={() => setOpen((value) => !value)}>
        {label}
      </button>
      {open ? (
        <ul className="dropdown-menu" role="menu">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                role="menuitem"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
