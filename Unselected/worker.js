const amqp = require('amqplib/callback_api');
const dbConnection = require('./db');
const OpenAI = require('openai').default;
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeArticle(content) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error while summarizing the article:', error);
        throw error;
    }
}

async function processArticles() {
    const client = await dbConnection;
    const db = client.db("blackboardDatabase");
    const blackboard = db.collection('articles');

    // Find and summarize articles
    const articlesToSummarize = await blackboard.find({ status: 'fetched' }).toArray();
    for (let article of articlesToSummarize) {
        //const summary = await summarizeArticle(article.content);
        const summary = article.content
        await blackboard.updateOne({ _id: article._id }, { $set: { summary: summary, status: 'summarized' } });
    }

    // Find and score articles
    const articlesToScore = await blackboard.find({ status: 'summarized' }).toArray();
    for (let article of articlesToScore) {
        // Simulated scoring
        const credibilityScore = Math.floor(Math.random() * 9 + 1);
        await blackboard.updateOne({ _id: article._id }, { $set: { credibilityScore: credibilityScore, status: 'completed' } });
    }
}

// Poll the blackboard every 10 seconds (10000 ms)
setInterval(processArticles, 10000);
