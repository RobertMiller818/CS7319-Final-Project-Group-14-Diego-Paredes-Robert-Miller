const amqp = require('amqplib/callback_api');
const dbConnection = require('./db');
const OpenAI = require('openai').default;
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const { Article } = require('./models');

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

amqp.connect(process.env.RABBITMQ_CONN_URL, (err, conn) => {
    if (err) {
        console.error('Error connecting to RabbitMQ', err);
        process.exit(1);
    }
    conn.createChannel(async (err, ch) => {
        if (err) {
            console.error('Error creating channel in RabbitMQ', err);
            process.exit(1);
        }

        const queue = 'article_queue';

        ch.assertQueue(queue, { durable: false });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        ch.consume(queue, async (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
            const articleData = JSON.parse(msg.content.toString());

            const client = await dbConnection;
            const db = client.db("appDatabase");
            const collection = db.collection('articles');

            //articleData.summary = await summarizeArticle(articleData.content);
            articleData.summary = articleData.content
            articleData.credibilityScore = Math.floor(Math.random() * 9 + 1);

            try {
                if (!(articleData.title == "[Removed]" || articleData.content == "[Removed]" || articleData.summary == undefined || articleData.credibilityScore == undefined)) {
                    await collection.insertOne(articleData);
                    console.log('Article processed and saved:', articleData);
                } else {
                    console.log('Article processed but not saved:', articleData);
                }
            } catch (error) {
                console.error('Error saving article:', error);
            }
        }, { noAck: true });
    });
});
