import {getUserData, logout, userLink } from "./helper.js";

async function response(url,token,data){
    const response = await fetch(url, {
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // Включаем токен в заголовок Authorization
        },
        body:JSON.stringify(data),
        }
    );

    if (response.ok){
        const articles = await response.json();
        return articles;
    }else{
        return {"Error":"old password doesn't match"};
    }
}

document.addEventListener("DOMContentLoaded",(event)=>{
    event.preventDefault();
    
    const errorMessage = document.getElementById('error-block');
    const userData = getUserData();
    const userToken = userData.token;
    
    userLink(userData.user)

    document.getElementById('change-button').addEventListener('click', async(event)=>{
        event.preventDefault(); 

        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;


        if (oldPassword.trim()==="" || newPassword.trim()===""){
            errorMessage.innerText = "Fields are empty!";
            throw new Error ("Fields are empty");
        }

        const password = {
            'old-password':oldPassword,
            'new-password':newPassword
        }

        const data = await response(
            'http://127.0.0.1:8000/api/v2/user/change-password/',userToken,password
        );

        if ("Error" in data){
            errorMessage.innerText = `${data['Error']}`;
        }
    })
    
    document.getElementById('old-password-checkbox').addEventListener('click',()=>{
        const oldPassword = document.getElementById('old-password');
        if (oldPassword.type === "password"){
            oldPassword.type = "text";
        }else{
            oldPassword.type = "password";
        }
    })

    document.getElementById('new-password-checkbox').addEventListener('click',()=>{
        const newPassword = document.getElementById('new-password');
        if (newPassword.type === "password"){
            newPassword.type = "text";
        }else{
            newPassword.type = "password";
        }
    })

    document.getElementById('for-logout').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
})