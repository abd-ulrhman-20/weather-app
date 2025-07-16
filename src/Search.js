import { useState } from 'react';
function Search({ fetchWeather }) {
    const [cityInput, setCityInput] = useState('');
    const handleSearch = () => {
        if (!cityInput.trim()) return;
        fetchWeather(cityInput);
    };
    return (
        <div className="my-input-group">
            <input
                type="text"
                className="my-input-group-input shadow"
                placeholder="Enter a city name..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
            />
            <button className="my-btn shadow" onClick={handleSearch}>
                Search
            </button>
        </div>
    )
}

export default Search
