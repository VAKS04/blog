import { userLink,getUserData } from "./helper.js";

document.addEventListener('DOMContentLoaded',async ()=>{
    const user = getUserData().user;
    userLink(user);
    document.getElementById('form').addEventListener('submit',async (event)=>{
        event.preventDefault();
        const error_message = document.getElementById('error-block');
        try{
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            if ((email.trim() === "")||(password.trim() === "")){
                // console.log('Error with field');
                throw Error("Fileds are empty");
            }
            const response = await fetch('http://127.0.0.1:8000/api/v2/login/',{
                method:"POST",
                headers:
                {
                    'Content-Type':'application/json',
                },
                credentials: 'include',
    
                body:JSON.stringify({email,password})
            }
            );
            if (response.ok){
                const userdata = await response.json();
                // console.log(userdata.token);
                // console.log(userdata.user);
    
                // Сохранение токена и данных пользователя в localStorage
                localStorage.setItem('token', userdata.token);
    
                localStorage.setItem('user',JSON.stringify(userdata.user));
    
                window.location.href="./user_page.html";
            }else{
                throw Error("User not found");
            }
    
        }catch(error){
            error_message.innerText = "Check your data's fields";
            throw new Error("Check your data's filds");
        }
    })
})
