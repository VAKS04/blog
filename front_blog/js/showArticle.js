import { logout,getUserData } from "./helper.js";

async function getArticle(creater, title) {
    const response = await fetch(`http://127.0.0.1:8000/api/v2/article/${creater}/${title}/`);

    if (response.ok) {
        const article = await response.json();
        return article;
    } else {
        return {"detail": "request failed"};
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const creater = params.get('creater');
    const title = params.get('title');

    const user = getUserData().user;
    const userLink = document.getElementsByClassName('reg-auth-link')[0];
    // console.log(userLink);
    if (user){
        userLink.innerHTML = `<a href="user_page.html">${user.username}</a>/<a id = "for-logout">Logout</a>`
    }

    if (creater && title) {
        try {
            const article = await getArticle(creater, title);
            if (article.detail !== "request failed") {
                document.getElementById('article-title').textContent = article.title;
                document.getElementById('article-content').innerText += article.text;
                document.getElementById('article-creater').textContent = `Creater : ${article.creater}`;
            } else {
                document.getElementById('article-content').textContent = 'Article not found.';
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            document.getElementById('article-content').textContent = 'Error fetching article.';
        }
    } else {
        document.getElementById('article-content').textContent = 'No article creater or title provided in URL.';
    }
    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
    
        logout();
    });
});
