import { logout, userLink, getUserData, updateOrDeleteArticle, tags} from "./helper.js";

async function responses(url){
    const response = await fetch(url);

    if (response.ok){
        const articles = await response.json();
        console.log(articles);
        return articles;
    }else{
        return {"detail":"request is fould"};
    }
}

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
    const idArticle = params.get('title');
    const userData = getUserData();
    const user = userData.user;
    const token = userData.token;
    const mainText = document.getElementsByClassName('container-create-article')[0];
    
    userLink(user);
    updateOrDeleteArticle(mainText);

    const titleBlock = document.getElementById('title');
    const textBlock = document.getElementById('text');

    const response = await getUserArticle(
        `http://127.0.0.1:8000/api/v2/user/article/${user.username}/${idArticle}/`
        ,token);
    
    console.log(response);
    
    titleBlock.value = response.title;
    textBlock.value = response.text;
 
    document.getElementById('update').addEventListener('click',async (event) =>{
        event.preventDefault();

        const checkboxes = document.querySelectorAll(".tags input[type='checkbox']");
        const selectedTags = [];
    
        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            selectedTags.push(checkbox.name);
          }
        });

        const new_title = titleBlock.value
        const text = textBlock.value 

        const data = {
            "id":idArticle,
            "title":new_title,
            "text":text,
            "tags":selectedTags
        }

        const response = await updateArticle(
            `http://127.0.0.1:8000/api/v2/user/article/update/`,
            token, data)
        location.reload()

    })

    document.getElementById('delete').addEventListener('click',async (event)=>{
        event.preventDefault();
        console.log("worked");

        const response = await deleteArticle(
            `http://127.0.0.1:8000/api/v2/user/article/delete/${user.username}/${idArticle}/`,
            token)
    
            alert(response.detail);
            window.location.href = "user_page.html";
    })

    document.getElementById('tags').addEventListener('click', async (event)=>{
        event.preventDefault();
        const containerTags = document.getElementsByClassName('container-tags')[0];
        const blockContent = document.getElementsByClassName('list-tags')[0];
        
        const url = "http://127.0.0.1:8000/api/v2/tag/";
        const tagResponse = await responses(url);

        if (blockContent){
            blockContent.remove();
        }else{
            const newBlockContent = document.createElement("div");
            newBlockContent.className = "list-tags";

            tags(newBlockContent,tagResponse,response.tags);
            containerTags.appendChild(newBlockContent);
            console.log(response.tags)
        }
    })

    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
})