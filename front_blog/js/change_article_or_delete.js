import { logout,userLink ,getUserData, updateOrDeleteArticle} from "./helper.js";

async function getUserArticle(url,token){
    try{
        const response = await fetch(url,{
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

async function updateArticle(url,token,data){
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}` // Включаем токен в заголовок Authorization
            },
            body:JSON.stringify(data)
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
async function deleteArticle(url,token){
    try{
        const response = await fetch(url,{
            method:"DELETE",
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

document.addEventListener("DOMContentLoaded", async (event) =>{
    event.preventDefault()
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const userData = getUserData();
    const user = userData.user;
    const token = userData.token;
    const mainText = document.getElementsByClassName('container-create-article')[0];
    
    userLink(user);
    updateOrDeleteArticle(mainText);

    const titleBlock = document.getElementById('title');
    const textBlock = document.getElementById('text');

    // console.log(userData.user.username);
    const response = await getUserArticle(
        `http://127.0.0.1:8000/api/v2/user/article/${user.username}/${title}/`
        ,token);
    
    titleBlock.value = response.title;
    textBlock.value = response.text;

    document.getElementById('update').addEventListener('click',async (event) =>{
        event.preventDefault();
        console.log("block update working");
        const new_title = titleBlock.value
        const text = textBlock.value 
        const data = {
            "title":new_title,
            "text":text
        }
        const response = await updateArticle(
            `http://127.0.0.1:8000/api/v2/user/article/update/${user.username}/${title}/`,
            token, data)
        location.reload()

    })
    document.getElementById('delete').addEventListener('click',async (event)=>{
        event.preventDefault();
        console.log("worked");

        const response = await deleteArticle(
            `http://127.0.0.1:8000/api/v2/user/article/delete/${user.username}/${title}/`,
            token)
    
            alert(response.detail);
            window.location.href = "user_page.html";
    })
    // Обработчик для кнопки "Logout"
    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
})