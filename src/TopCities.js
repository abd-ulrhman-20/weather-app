function TopCities({ topCitiesWeather }) {

    return (
        <div className="row g-4 mb-4">
            {topCitiesWeather.map((city) => (
                <div className="col-md-3" key={city.name}>
                    <div className="card shadow text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title">{city.name}</h5>
                            <img
                                src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
                                alt={city.description}
                                width="60"
                            />
                            <h3>{city.temp}</h3>
                            <p className="text-capitalize">{city.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TopCities
