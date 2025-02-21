document.querySelectorAll(".submit-btn").forEach(button => { 
button.addEventListener("click", function(){ 
    const category = this.getAttribute("data-category");

    const blogData = { 
        title: document.getElementById("title").value, 
        creator: document.getElementById("creator").value, 
        name: document.getElementById("name").value, 
        textArea: document.getElementById("textarea").value,
        category: category
    };

    fetch('https://jsonplaceholder.typicode.com/posts', { 
        method: "POST",  
        headers: {
            'Content-type': `application/json; charset=UTF-8`,
        }, 
        body: JSON.stringify(blogData)
    })
    .then(response => response.json())
    .then(json => {console.log(json);
        
        blogData.id = json.id;

        displayPosts(blogData, category);

        document.getElementById("title").value = '';
        document.getElementById("creator").value = '';
        document.getElementById("name").value = '';
        document.getElementById("textarea").value = '';
    })
    .catch((error) => console.error(`Error posting data`, error));
});
});


function displayPosts(post, category){
    const blogContainer = document.getElementById(`${category}-blog-container`);

    let creatorLabel = "Author";
    if(category === "music"){
        creatorLabel = "Artist";
    } else if(category === "movie"){
        creatorLabel = "Director";
    }

    if(post.title.length <= 4){
        alert(`The title of the book needs to be longer than 4 characters.`);
    } else if(post.creator.length <= 4){
        alert(`The ${creatorLabel} name needs to be longer than 4 characters.`);
    } else if(post.name.length <= 2){
        alert(`Your name needs to be longer than 2 characters.`);
    } else if(post.textArea.length <= 30){
        alert(`Your blog post must have more than 30 characters.`);
    }else{
    const blogPost = document.createElement("div");
    blogPost.id = `post-${post.id}`;
    blogPost.innerHTML = 
    `  <div class="post" > <p><strong> Title: ${post.title}</strong></p>
    <p><strong> ${creatorLabel}: ${post.creator}</strong></p>
    <p><strong>Post Written By: ${post.name}</strong></p>
    <p>${post.textArea}</p> 
    <button type="text" class="delete-btn" data-id="${post.id}" >Delete</button>
    </div>`

    blogContainer.appendChild(blogPost);

    const deleteButton = blogPost.querySelector(".delete-btn")
        deleteButton.addEventListener("click", function(){
    const postId = this.dataset.id;
    
        
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE", 
    })
    .then(response => {
        if(response.ok){
            console.log(`Post ${postId} deleted successfully!`);
            blogPost.remove();
        }
    })
    .catch(error => console.error(`error deleting data`, error));
        })
    }
    };






fetch('https://jsonplaceholder.typicode.com/posts')
.then(response => response.json())
.then(json => {
    console.log(json)
   /* json.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = 
        `    <p><strong>${post.title}</strong></p>
        <p>${post.body}</p> 
        <button type="text" class="delete-btn" data-id="${post.id}" >Delete</button>`;

        document.body.appendChild(postDiv);
    })*/
})
.catch(error => console.error(`Error fetching post`, error));
