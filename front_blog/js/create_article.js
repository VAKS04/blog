import { logout,getUserData,userLink,createFormArticle} from "./helper.js";

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
        console.log(titleDoc);
        const creater = JSON.parse(localStorage.getItem('user'));
        const data = {
            "title":titleDoc,
            "text":textDoc,
            "creater":creater.username
        }
    
        
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
                console.log("response ok")
            }else{
                console.log('error')
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
})


