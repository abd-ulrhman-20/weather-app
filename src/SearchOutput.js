function SearchOutput({ weather, isMetric, forecast }) {
    return (
        <div className="row">
            <div className="col-md-6 mb-4">
                <div className="card shadow text-center h-100">
                    <div className="card-body">
                        <h4 className="card-title">Today in {weather.city}</h4>
                        <h1 className="display-4">{weather.temp}</h1>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt="Weather Icon"
                            style={{ width: '80px' }}
                        />
                        <p className="lead text-capitalize">{weather.description}</p>
                        <div className="row mt-4">
                            <div className="col"><p>💧 Humidity: {weather.humidity}%</p></div>
                            <div className="col"><p>🌬️ Wind: {weather.wind} {isMetric ? 'km/h' : 'mph'}</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card shadow h-100">
                    <div className="card-body">
                        <h5 className="card-title text-center">📆 Weekly Forecast</h5>
                        <ul className="list-group list-group-flush">
                            {forecast.map(({ day, temp, icon }) => (
                                <li key={day} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{day}</span>
                                    <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="icon" width="40" />
                                    <span>{temp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchOutput
