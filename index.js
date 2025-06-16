import express from  'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();
const port =3000;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.render('index.ejs', { weather: null, error: null });
});

app.post('/predict', async (req, res) => {
  const city = req.body.city;
  const apiKey = "3ffa24150a329b000811d84acf84de48";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    const forecasts = data.list;
    const current = forecasts[0];
    const tomorrowForecasts = forecasts.slice(8, 16);

    const willRain = tomorrowForecasts.some(f =>
      f.weather.some(w => w.main.toLowerCase().includes("rain"))
    );

    const weather = {
      city: data.city.name,
      temp: current.main.temp,
      desc: current.weather[0].description,
      humidity: current.main.humidity,
      rainTomorrow: willRain
    };

    res.render("index.ejs", { weather, error: null });

  } catch (error) {
    console.error("Error fetching weather data:", error.response?.data || error.message);
    res.render("index.ejs", { weather: null, error: "Could not fetch weather data. Try again." });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});