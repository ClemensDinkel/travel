const countries = require('./world');
const express = require('express');
const app = express();
const port = 3000;
const compareAlphabetically = (a, b) => {
    if (a.name > b.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
};
app.use(express.json());

app.delete('/api/countries/:code', (req, res) => {
    let { code } = req.params;
    let country = countries.find(country => {
        return (
            country.alpha2Code.toLowerCase() === code.toLowerCase().trim() ||
            country.alpha3Code.toLowerCase() === code.toLowerCase().trim()
        )
    });
    const index = countries.indexOf(country);
    countries.splice(index, 1);
    res.send(`<div><img src="/flags/${country.alpha2Code.toLowerCase()}.png"/><p>Country with the code "${code}" has been deleted successfully</p></div>`)
});

app.get("/", (req, res) => {
    res.send('Hello, welcome to our fascinating API')
})

app.get('/api/countries', (req, res) => {
    if (req.query.sort) {
        const sortedCountries = [...countries].sort(compareAlphabetically);
        res.json(sortedCountries);
    } else {
        res.json(countries)
    };
});

app.get('/api/countries/:code', (req, res) => {
    console.log(`code is ${req.params.code}`);
    //console.log(countries)
    let country = countries.find(country => {
        return (
            country.alpha2Code.toLowerCase() === req.params.code.toLowerCase().trim() ||
            country.alpha3Code.toLowerCase() === req.params.code.toLowerCase().trim()
        )
    });
    console.log(country);
    if (!country) res.status(404).send("Error 404. Country not found")
    res.send(country)
});

app.post('/api/countries/add-country', (req, res) => {

    if (!countries.some(c => c.name == req.body.name) &&
        !countries.some(c => c.name == req.body.alpha2Code) &&
        !countries.some(c => c.name == req.body.alpha3Code)) {
        countries.push(
            {
                id: Date.now(),
                name: req.body.name,
                alpha2Code: req.body.alpha2Code,
                alpha3Code: req.body.alpha3Code
            });
    }
    else {
        console.log("This country exists already! You cannot add it again.")
    }
    res.send(countries);
    console.log(req.body);
});

app.post('/api/countries', (req, res) => {
    const newCountry = {
        id: countries.length + 1,
        name: req.body.name,
        alpha2Code: req.body.alpha2Code,
        alpha3Code: req.body.alpha3Code
    }
    countries.push(newCountry);
    res.send(countries)
});

app.put("/api/countries/:code", (req, res) => {
    let { code } = req.params;
    let country = countries.find(country => {
        return (
            country.alpha2Code.toLowerCase() === code.toLowerCase().trim() ||
            country.alpha3Code.toLowerCase() === code.toLowerCase().trim()
        )
    });
    if (country) {
        country.name = req.body.name;
        country.alpha2Code = req.body.alpha2Code;
        country.alpha3Code = req.body.alpha3Code;
    }
    else {
        res.status(404).send(`<h1>The country does not exist!</h1>`);
    }

    res.send(country)
});

//listen to

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})