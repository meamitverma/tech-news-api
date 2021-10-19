const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



   // arrow functions won't work here








const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/technology/',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/uk/technology',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/technology/',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/technology',
        base: 'https://www.nytimes.com',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/technology',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/technology',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/tech',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/tech/',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tech/',
        base: ''
    },
    {
        name: 'gadgetsnow',
        address: 'https://www.gadgetsnow.com/tech-news',
        base: 'https://www.gadgetsnow.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("tech")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Tech News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("tech")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))