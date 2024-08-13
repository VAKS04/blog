import { logout,getUserData,userLink,createFormArticle,tags} from "./helper.js";

async function response(url){
    const response = await fetch(url);

    if (response.ok){
        const articles = await response.json();
        console.log(articles);
        return articles;
    }else{
        return {"detail":"request is fould"};
    }
}

document.addEventListener("DOMContentLoaded",()=>{

    const token = getUserData().token;
    const user = getUserData().user;
    
    userLink(user);

    const mainText = document.getElementsByClassName('container-create-article')[0];

    if (!token){
        mainText.innerHTML = "<h1>You arn't authorization !</h1>";
    }else{
        createFormArticle(mainText);
    }

    document.getElementById('form').addEventListener('submit',async (event) => {
        event.preventDefault();
    
        const token = localStorage.getItem('token');
        const titleDoc = document.getElementById('title').value;
        const textDoc = document.getElementById('text').value;
        // console.log(titleDoc);
        // console.log(textDoc)

        const creater = JSON.parse(localStorage.getItem('user'));

        // console.log(creater.username)

        const checkboxes = document.querySelectorAll(".tags input[type='checkbox']");
        const selectedTags = [];
    
        // Собираем значения отмеченных чекбоксов
        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            selectedTags.push(checkbox.name);
          }
        });

        const data = {
            "title":titleDoc,
            "text":textDoc,
            "creater":creater.username,
            "tags":selectedTags
        };
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v2/article/create/',{
                method:"POST",
                headers:{
                    'Content-Type':"application/json",
                    "Authorization": `Token ${token}`
                },
                credentials:'include',
        
                body:JSON.stringify(data)
            });
        
            if (response.ok){
                const articles = await response.json();
            }else{
                return {"detail":"request is fould"}
            }
            window.location.href = "user_page.html";
    
        }catch (error){
            console.log("Error",error);
        }
    })

    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
    
        logout();
    });

    document.getElementById('tags').addEventListener('click', async (event)=>{
        event.preventDefault();
        const containerTags = document.getElementsByClassName('container-tags')[0];
        const blockContent = document.getElementsByClassName('list-tags')[0];
        
        
        const url = "http://127.0.0.1:8000/api/v2/tag/";
        const responseData = await response(url);

        if (blockContent){
            blockContent.remove();
        }else{
            const newContent = document.createElement("div");
            newContent.className = "list-tags";

            tags(newContent,responseData);
            containerTags.appendChild(newContent);
        }
    })
})