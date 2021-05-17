const countries = require('./world');
const express = require('express');
const router = express.Router();
router.use(express.json());

const { body, validationResult } = require('express-validator');

const compareAlphabetically = (a, b) => {
    if (a.name > b.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
};

const isValidCountry = (req) => {
    body('alpha2Code').isLength({ min: 2, max: 2 });
    body('alpha3Code').isLength({ min: 3, max: 3 });
    body('name').isLength({ min: 4 });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return { isValid: false, errors: errors };
    }
    return { isValid: true };
};

router.delete('/api/countries/:code', (req, res) => {
    let { code } = req.params;
    let country = countries.find(country => {
        return (
            country.alpha2Code.toLowerCase() === code.toLowerCase().trim() ||
            country.alpha3Code.toLowerCase() === code.toLowerCase().trim()
        )
    });
    const index = countries.indexOf(country);
    countries.splice(index, 1);
    res.send(`<div><p>Country with the code "${code}" has been deleted successfully</p></div>`)
});

router.get("/", (req, res) => {
    res.send('Hello, welcome to our fascinating API')
})

router.get('/api/countries', (req, res) => {
    //res.send(`<div><img src="/flags/ad.png"/></div>`);
    if (req.query.sort) {
        const sortedCountries = [...countries].sort(compareAlphabetically);
        res.json(sortedCountries);
    } else {
        res.json(countries)
    };
});

router.get('/api/countries/:code', (req, res) => {
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

router.post('/api/countries',
    body('alpha2Code').isLength({ min: 2, max: 2 }),
    body('alpha3Code').isLength({ min: 3, max: 3 }),
    body('name').isLength({ min: 4 }),

    (req, res) => {

        if (!countries.some(c => c.name == req.body.name) &&
            !countries.some(c => c.name == req.body.alpha2Code) &&
            !countries.some(c => c.name == req.body.alpha3Code)) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            } else {
                countries.push(
                    {
                        id: Date.now(),
                        name: req.body.name,
                        alpha2Code: req.body.alpha2Code,
                        alpha3Code: req.body.alpha3Code
                    });
            }
        } else {
            console.log("This country exists already! You cannot add it again.")
        }
        res.send(countries);
        console.log(req.body);
    });

/* router.post('/api/countries',
    body('alpha2Code').isLength({ min: 2, max: 2 }),
    body('alpha3Code').isLength({ min: 3, max: 3 }),

    (req, res) => {
        const newCountry = {
            id: countries.length + 1,
            name: req.body.name,
            alpha2Code: req.body.alpha2Code,
            alpha3Code: req.body.alpha3Code
        }
        countries.push(newCountry);
        res.send(countries)
    }); */

router.put("/api/countries/:code", (req, res) => {
    let { code } = req.params;

    let validationObj = isValidCountry(req);
    if (!validationObj.isValid) {
        return res.status(400).json({ errors: validationObj.errors.array() });
    }

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



module.exports = router;
