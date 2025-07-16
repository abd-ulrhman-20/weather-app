import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';

function CityEditor({ onUpdate }) {

    const [open, setOpen] = useState(false);
    const [cities, setCities] = useState(['New York', 'London', 'Tokyo', 'Paris']);

    useEffect(() => {
        const saved = document.cookie.split('; ').find(row => row.startsWith('topCities='));
        if (saved) {
            try {
                const val = JSON.parse(decodeURIComponent(saved.split('=')[1]));
                if (Array.isArray(val)) setCities(val);
            } catch { }
        }
    }, []);

    const handleChange = (index, value) => {
        const updated = [...cities];
        updated[index] = value;
        setCities(updated);
    };

    const save = () => {
        onUpdate(cities);
        setOpen(false);
    };
    return (
        <>
            <button
                className="btn btn-secondary position-fixed"
                style={{ bottom: '20px', left: '20px', zIndex: 9999 }}
                onClick={() => setOpen(true)}
            >
                ⚙️ Edit Cities
            </button>

            {open &&
                createPortal(
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <h5 className="mb-3">Edit Top Cities</h5>
                            {cities.map((city, idx) => (
                                <input
                                    key={idx}
                                    value={city}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    placeholder={`City ${idx + 1}`}
                                    className="form-control mb-2"
                                />
                            ))}
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={save}>Save</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}

export default CityEditor
