const general = {
    logout: function (){
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = "reg_page.html";
    },
    getUserData: function(){
        return {
            "user": JSON.parse(localStorage.getItem('user')),
            "token": localStorage.getItem('token')
        };
    },
    userLink: function(user){
        const userBlock = document.getElementsByClassName('reg-auth-link')[0];
        if(user){
            userBlock.innerHTML = `<a href="user_page.html">${user.username}</a>/<a id="for-logout">Logout</a>`;
            // Добавляем обработчик события здесь
            document.getElementById('for-logout').addEventListener('click', (event) => {
                event.preventDefault();
                this.logout();
            });
        }
        else{
            userBlock.innerHTML = '<a href="reg_page.html">Регистрация/Авторизация</a>';
        }
    },
    templateFormArticle: function(blockContent, buttons){
        blockContent.innerHTML = `
            <div class="container-margin">
                <form class="create-article-form" id="form">
                    <div class="form-title">Create article</div>
                    <div class="label-input">
                        <label>Title : </label>
                        <input type="text" id="title">
                    </div>
                    <div class="label-input">
                        <label>Text : </label>
                        <textarea id="text"></textarea>
                    </div>
                    <div class="tags">
                        <p>Добавьте тег, чтобы полнее описать вашу статью и быстро найти ее через поисковый запрос</p>
                        <p>--><a href="#" id="tags">Теги</a><--</p>
                        <div class="container-tags">
                        </div>
                    </div>
                    ${buttons}
                </form>
            </div>
        `;
    },
    tags:function(blockContent,jsonData,checkedList=undefined){
        if (checkedList === undefined){
            for (const key of jsonData){
                blockContent.innerHTML += `
                    <div class="tag">
                        <input type="checkbox" name="${key['slug']}">
                        <label>${key['tag']}</label>  
                    </div>
                `
            }
        }else{
            for (const key of jsonData){
                if(checkedList.includes(key['tag'])){
                    blockContent.innerHTML += `
                        <div class="tag">
                            <input type="checkbox" name="${key['slug']}" checked>
                            <label>${key['tag']}</label>  
                        </div>
                    `
                }else{
                    blockContent.innerHTML += `
                        <div class="tag">
                            <input type="checkbox" name="${key['slug']}">
                            <label>${key['tag']}</label>  
                        </div>
                    `
                }
            }
        }
    },
    createArticleButton: function(){
        return `    
            <div class="create-article">
                <button type="submit">Create</button>
            </div>
        `;
    },
    updateAndDeleteButton: function(){
        return `
            <div class="buttons">
                <div class="update-article">
                    <button class="update" id="update" type="submit">Update</button>
                </div>
                <div class="delete-article">
                    <button class="delete" id="delete" type="submit">Delete</button>
                </div>
            </div>
        `;
    },
    createFormArticle: function(blockContent){
        general.templateFormArticle(blockContent, general.createArticleButton());
    },
    updateOrDeleteArticle: function(blockContent){
        general.templateFormArticle(blockContent, general.updateAndDeleteButton());
    }
}

export const logout = general.logout;
export const getUserData = general.getUserData;
export const userLink = general.userLink;
export const createFormArticle = general.createFormArticle;
export const updateOrDeleteArticle = general.updateOrDeleteArticle;
export const tags = general.tags;