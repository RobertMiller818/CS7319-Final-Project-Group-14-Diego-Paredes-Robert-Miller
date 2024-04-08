const { Article } = require('./models'); // The same model file from previous steps
const mongoose = require('mongoose');
require('dotenv').config();

async function seedDatabase() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: mongoose.ServerApiVersion.v1,
    });

    const articles = [
        { title: 'Sample Article 1', content: 'Content of sample article 1', summary: 'Summary 1', credibilityScore: 8 },
        { title: 'Sample Article 2', content: 'Content of sample article 2', summary: 'Summary 2', credibilityScore: 7 },
        // More seed articles...
    ];

    // Delete all existing articles (if necessary)
    await Article.deleteMany({});
    // Insert seed articles
    for (let article of articles) {
        await new Article(article).save();
    }

    console.log('Database seeded!');
    await mongoose.connection.close();
}

seedDatabase().catch(console.error);
