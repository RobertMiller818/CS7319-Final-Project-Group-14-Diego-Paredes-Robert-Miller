const express = require('express');
const amqp = require('amqplib/callback_api');
const axios = require('axios');
const cors = require('cors');
const dbConnection = require('./db'); // Import the database connection
require('dotenv').config();

const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

const NEWS_API_KEY = process.env.NEWS_API_KEY; // Ensure this is in your .env file

// Endpoint to fetch articles based on a topic and publish them to the queue
app.post('/submit-topic', async (req, res) => {
    const topic = req.body.topic;
    const client = await dbConnection;
    const db = client.db("blackboardDatabase");
    const blackboard = db.collection('articles');

    try {
        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${NEWS_API_KEY}`);
        const articles = newsResponse.data.articles.slice(0, 5).map(article => ({
            title: article.title,
            content: article.description,
            status: 'fetched'
        }));

        await blackboard.insertMany(articles);
        res.json({ message: 'Articles submitted for processing' });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Error fetching articles');
    }
});

// Endpoint to retrieve processed articles from the database
app.get('/articles', async (req, res) => {
    const client = await dbConnection;
    const db = client.db("blackboardDatabase"); // Replace with your actual db name
    const collection = db.collection('articles');

    try {
        const articles = await collection.find().sort({ createdAt: -1 }).limit(10).toArray();
        res.json(articles);
    } catch (error) {
        console.error('Error retrieving articles:', error);
        res.status(500).send('Error retrieving articles');
    }
});

app.get('/article/:id', async (req, res) => {
    const articleId = req.params.id;

    if (!ObjectId.isValid(articleId)) {
        return res.status(404).send('Article not found');
    }

    const client = await dbConnection;
    const db = client.db("blackboardDatabase");
    const collection = db.collection('articles');

    try {
        const article = await collection.findOne({ _id: new ObjectId(articleId) });
        if (article) {
            res.json(article);
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error retrieving article:', error);
        res.status(500).send('Error retrieving article');
    }
});


app.get('/', (req, res) => {
    res.send('Credibility Web Ranking System Backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
