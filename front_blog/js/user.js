import { logout,userLink } from "./helper.js";

function updateForm(options,data){
    options.image.src = data.image;
    options.first_name.value = data.first_name;
    options.last_name.value = data.last_name;
    options.email.value = data.email;
    options.username.value = data.username;
    // options.userLink.innerHTML = `<a href="user_page.html">${data.username}</a>/<a id = "for-logout">Logout</a>`

}

async function getUserArticle(url,token){
    try{
        const response = await fetch(url,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}` // Включаем токен в заголовок Authorization
            },
        })
        if(response.ok){
            const data = await response.json();
            return data;
        }
    }catch (error){
        console.log(`Error :${error}`);
        return Error("error");
    }


}

async function changeUserData(url,token,data){
    try {
        const response = await fetch(url,{
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // Включаем токен в заголовок Authorization
        },
        body:JSON.stringify(data)
        });

    if (response.ok) {
        const userData = await response.json();
        console.log("Данные с ответа");
        console.log(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        updateForm(Form(), userData);
        // console.log('User data updated successfully:', userData);
    } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
    }
} catch (error) {
    console.error('Error:', error);
}
}

function changeDataForm(){
    const image = document.getElementById('new-image').value;
    const first_name = document.getElementById('first-name').value;
    const last_name = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;

    return {
        "image":image,
        "first_name":first_name,
        "last_name":last_name,
        "email":email,
        "username":username
    }
}

function Form(){

    const image = document.getElementById('image');
    const first_name = document.getElementById('first-name');
    const last_name = document.getElementById('last-name');
    const email = document.getElementById('email');
    const username = document.getElementById('username');

    return {
        "image":image,
        "first_name":first_name,
        "last_name":last_name,
        "email":email,
        "username":username,
    }
}

function is_Auth() {
    return !!localStorage.getItem('user'); 
}

function getUserData(){
    return {
        "user": JSON.parse(localStorage.getItem('user')),
        "token":localStorage.getItem('token')
    }
}

function goToPage(){
    const aLink = document.querySelectorAll('a.a-link');
    aLink.forEach(element => {
        element.addEventListener('click',(even)=>{
            even.preventDefault();
            const link = element.getAttribute('href');
            window.location.href = `change_article_or_delete.html?${link}`;
            },false);
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!is_Auth()) {
        window.location.href = 'page_not_found.html';
    } else {
        const user = getUserData().user;
        const token = getUserData().token;
        userLink(user);

        updateForm(Form(), user);
    
        const data = await getUserArticle(`http://127.0.0.1:8000/api/v2/user/article/${user.username}/`,token);
        const blockArticle = document.getElementsByClassName('article-block')[0];
        console.log(blockArticle);
        console.log(data);
        if('detail' in data){
            blockArticle.innerHTML += `
            <div class="main-subtitle">${data.detail}</div>
            `
        }else{

        for (const data_ of data){
                
            const dataText = data_.text.substring(0,100) + "...";
            
            let content_block = `
                <div class="creater-block">Creater : ${data_.creater}</div>
            `

            if (data_.tags.length){
                let tags = ""; 
                
                for (const i of data_.tags){
                    if (tags.length <= 50){
                        tags += `#${i} `;
                    }else{
                        tags += "...";
                        break;
                    }
                }

                content_block += `
                    <div class="tag-block">${tags}</div>
                `
            }

            blockArticle.innerHTML += `
                <div class="content-article-block">
                    <div class="title-block">
                        <a class="a-link" href="title=${data_.title}&creater=${data_.creater}">${data_.title}</a>
                    </div>
                    <div class="text-block">${dataText}</div>
                    <div class="short-inf">
                        ${content_block}
                    </div>
                </div>
                `;
            }
        }
        
        console.log(`Article data - ${data}`);
        console.log(data);
        goToPage();       
    }
    // Обработчик для формы обновления данных пользователя
    document.getElementById('change-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = getUserData().user;
        const token = getUserData().token;
        const formData = changeDataForm();
        const data = {
            "image": formData.image !== "" ? formData.image: "",
            "first_name": formData.first_name !== "" ? formData.first_name: "",
            "last_name": formData.last_name !== "" ? formData.last_name: "",
            "email": formData.email !== "" ? formData.email: "",
            "username": formData.username !== "" ? formData.username: "",
        };
        console.log("Данные с функции");
        console.log(data);
        await changeUserData(`http://127.0.0.1:8000/api/v2/user/${user.email}/`,token,data);
        location.reload();
      
    });

    // Обработчик для кнопки "Logout"
    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
});