import { userLink, getUserData} from "./helper.js";

document.addEventListener('DOMContentLoaded',async ()=>{
    const user = getUserData().user;
    userLink(user);
    document.getElementById('form').addEventListener('submit',async (event)=>{
        event.preventDefault();
        try{
            let username =document.getElementById('username').value;
            let email =document.getElementById('email').value;
            let password =document.getElementById('password').value;
            let password2 =document.getElementById('password2').value;
    
            console.log(`${username}-${email}-${password}-${password2}`);
            const error_message = document.getElementById('error-block');
    
            if (password !== password2){
                error_message.innerText = "Check your data"
                throw new Error ("Invalid data at form");
            }
    
            const response = await fetch('http://127.0.0.1:8000/api/v2/user/reg/',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({username,email,password})
            }
        );
        alert(`User ${username} have been created`)
        // return await response.json()
    
        }catch(error){
            throw new Error('Invalid data');
        }
    })
})

