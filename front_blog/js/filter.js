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

document.addEventListener("DOMContentLoaded", async(event)=>{
    event.preventDefault();
    const filterblock = document.getElementsByClassName('filter-content')[0];
    filterblock.innerHTML = "";
    const url = "http://127.0.0.1:8000/api/v2/article/filter/";

    const responseData = await response(url);
    // console.log('tag');

    for (const key of responseData){
        filterblock.innerHTML += `
            <div class="tag">
                <input type="checkbox" name = "${key['slug']}" >
                <label>${key['tag']}</label>  
            </div>
        `
    }

    filterblock.innerHTML += `
        <div class="filter-button">
            <button type="submit">Искать</button>
        </div>
    `
    
    document.getaddEventListener('click', async(event)=>{
        event.preventDefault()
        const url = "http://127.0.0.1:8000/api/v2/article/";
        const responseData = await response(url);

    })
})
