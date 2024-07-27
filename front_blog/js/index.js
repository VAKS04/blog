import { logout,getUserData,userLink } from "./helper.js";

// function logout(){
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     window.location.href = "reg_page.html"
// }

async function response(url){
    const response = await fetch(url);

    if (response.ok){
        const articles = await response.json()
        return articles
    }else{
        return {"detail":"request is fould"}
    }

}
function goToPage(){
    const aLink = document.querySelectorAll('a.a-link');
    aLink.forEach(element => {
        // console.log(element);
        element.addEventListener('click',(even)=>{
            even.preventDefault();
            const link = element.getAttribute('href');
            window.location.href = `article_page.html?${link}`;
            },false);
    })
}

// document.addEventListener('DOMContentLoaded', async () => {
//     const content = document.getElementById("article-block");    
//     const response = await fetch('http://127.0.0.1:8000/api/v2/article/');

//     try{
//         if (response.ok){
//             const articles = await response.json();
         
//             for (const data_ of articles){
                
//                 const dataText = data_.text.substring(0,100) + "...";
//                 content.innerHTML += `
//                 <div class="content-article-block">
//                     <div class="title-block">
//                         <a class="a-link" href="title=${data_.title}&creater=${data_.creater}">${data_.title}</a>
//                     </div>
//                     <div class="text-block">${dataText}</div>
//                     <div class="creater-block">Creater : ${data_.creater}</div>
//                 </div>
//                 `;
//             }
//             const a_link = document.querySelectorAll('a.a-link');
//             console.log(a_link); 
            
//         }else{
//             return {"detail":"request is fould"}
//         }
//     }catch (error){
//         console.log("Error",error);
//     }


//     console.log(data);

// })

document.addEventListener('DOMContentLoaded',async () => {
    const user = getUserData().user;
    userLink(user);
    const content = document.getElementById("article-block");  
    // const userLink = document.getElementsByClassName('reg-auth-link')[0];
    // console.log(userLink);

    try {
        const responseData = await response('http://127.0.0.1:8000/api/v2/article/');
        console.log(responseData);

        for (const data_ of responseData){
                
            const dataText = data_.text.substring(0,100) + "...";
            content.innerHTML += `
                <div class="content-article-block">
                    <div class="title-block">
                        <a class="a-link" href="title=${data_.title}&creater=${data_.creater}">${data_.title}</a>
                    </div>
                    <div class="text-block">${dataText}</div>
                    <div class="creater-block">Creater : ${data_.creater}</div>
                </div>
                `;
            }
        goToPage();
    }catch (error){
        console.log("Error",error);
    }
    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
    
        logout();
    });
})






