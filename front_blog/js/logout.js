function logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = "reg_page.html"
}

document.getElementById('for-logout').addEventListener('click', (event) => {
    event.preventDefault();

    logout();
});