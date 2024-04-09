// Function to submit a topic and retrieve articles
function submitTopic() {
    const topic = document.getElementById('search-input').value;
    if (topic) {
        fetch('http://localhost:3000/submit-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic: topic })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // After submitting the topic, get articles
                getArticles();
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    }
}

// Function to retrieve and display articles from the backend
function getArticles() {
    fetch('http://localhost:3000/articles')
        .then(response => response.json())
        .then(articles => {
            const container = document.getElementById('articles-container');
            container.innerHTML = '';
            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'article';
                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <p class="summary">${article.summary || 'No summary available'}</p>
                    <p class="score">Credibility Score: ${article.credibilityScore || 'N/A'}</p>
                `;
                articleElement.onclick = () => window.location.href = `articlepage.html?articleId=${article._id}`;
                container.appendChild(articleElement);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Function to handle click events on articles and possibly display more details
function displayArticleDetail(articleId) {
    console.log('Article clicked:', articleId);
    // Placeholder for expansion or detailed view logic
}

// Call getArticles on page load to display the latest articles
document.addEventListener('DOMContentLoaded', getArticles);
