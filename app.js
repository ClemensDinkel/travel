const countries = require('./countries');
const express = require('express');
/* const bodyParser = require('body-parser'); */
const app = express();
const port = 3000;
app.use(express.json());

/* app.use(bodyParser.urlencoded({ extended: false })); */

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

/* res.send(countries.sort((n1, n2) => n1.name - n2.name)) */

/* app.get('/api/countries/add-country', (req, res) => {
    res.send(`
    <form action="/api/countries/add-country" method="POST">
        Name:
        <input name="name" type="text"/>
        Alpha 2 Code:
        <input name="alpha2Code" type="text"/>
        Alpha 3 Code:
        <input name="alpha3Code" type="text"/>
        <button type="submit">submit</button>
    </form>
    `);
}); */

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
})


app.delete('/api/countries/:id', (req, res) => {
    res.send('Got a DELETE request at /user'); // refactor later
});

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

const compareAlphabetically = (a, b) => {
    if (a.name > b.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
};