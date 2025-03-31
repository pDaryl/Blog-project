function getCreatorLabel(category) {
    if(category === "music") return "Artist";
    if(category === "movie") return "Director";
    return "Author";
}

function postingConditions(post, creatorLabel){
    if(post.title.length <= 4){
        alert(`The title of the book needs to be longer than 4 characters.`);
        return false;
    }
    if(post.creator.length <= 4){
        alert(`The ${creatorLabel} name needs to be longer than 4 characters.`);
        return false;
    }
    if(post.name.length <= 2){
        alert(`Your name needs to be longer than 2 characters.`);
        return false;
    }
    if(post.textArea.length <= 30){
        alert(`Your blog post must have more than 30 characters.`);
        return false;
    }
    return true;
}

function createBlogPostElement(post, creatorLabel) {
    const blogPost = document.createElement("div");
    blogPost.id = `post-${post.id}`;
    blogPost.innerHTML = `
    <div class="post">
        <p><strong class="post-title">Title: ${post.title}</strong></p>
        <p><strong class="post-creator">${creatorLabel}: ${post.creator}</strong></p>
        <p><strong class="post-name">Post Written By: ${post.name}</strong></p>
        <p class="post-text">${post.textArea}</p>
        <button type="button" class="delete-btn" data-id="${post.id}">Delete</button>
        <button type="button" class="edit-btn" data-id="${post.id}">Edit</button>
    </div>`;
    return blogPost;
}

function theDeleteButton(blogPost, postId) {
    blogPost.querySelector(".delete-btn").addEventListener("click", () => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, { method: "DELETE" })
        .then(response => {
            if(response.ok){
                console.log(`Post ${postId} deleted successfully!`);
                blogPost.remove();
            }
        })
        .catch(error => console.error("Error deleting data", error));
    });
}

function theEditButton(blogPost, postId, creatorLabel){
    const editButton = blogPost.querySelector(".edit-btn");
    editButton.addEventListener("click", function(){
        console.log("Editing post", postId);
        const postTitle = blogPost.querySelector(".post-title");
        const postCreator = blogPost.querySelector(".post-creator");
        const postName = blogPost.querySelector(".post-name");
        const postTextArea = blogPost.querySelector(".post-text");
        
        postTitle.innerHTML = `<input type="text" value="${postTitle.textContent.replace('Title: ', '')}"/>`;
        postCreator.innerHTML = `<input type="text" value="${postCreator.textContent.replace(creatorLabel + ': ', '')}"/>`;
        postName.innerHTML = `<input type="text" value="${postName.textContent.replace('Post Written By: ', '')}" />`;
        postTextArea.innerHTML = `<textarea>${postTextArea.textContent.trim()}</textarea>`;
        
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Changes";
        editButton.replaceWith(saveButton);
        
        saveButton.addEventListener("click", function(){
            const updatedTitle = postTitle.querySelector("input").value;
            const updatedCreator = postCreator.querySelector("input").value;
            const updatedName = postName.querySelector("input").value;
            const updatedTextArea = postTextArea.querySelector("textarea").value;
            
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: "PATCH",
                headers: { 'Content-type': "application/json; charset=UTF-8" },
                body: JSON.stringify({ title: updatedTitle, creator: updatedCreator, name: updatedName, textArea: updatedTextArea })
            })
            .then(response => response.json())
            .then(updatedPost => {
                console.log("Post successfully updated", updatedPost);
                postTitle.innerHTML = `Title: ${updatedPost.title}`;
                postCreator.innerHTML = `${creatorLabel}: ${updatedPost.creator}`;
                postName.innerHTML = `Post Written By: ${updatedPost.name}`;
                postTextArea.innerHTML = updatedPost.textArea;
                saveButton.replaceWith(editButton);
            })
            .catch(error => console.error("Error updating post", error));
        });
    });
}

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
        if (!postingConditions(blogData, getCreatorLabel(category))) return;
        
        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { 'Content-type': "application/json; charset=UTF-8" },
            body: JSON.stringify(blogData)
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            blogData.id = json.id;
            displayPosts(blogData, category);
            ["title", "creator", "name", "textarea"].forEach(id => document.getElementById(id).value = "");
        })
        .catch(error => console.error("Error posting data", error));
    });
});

function displayPosts(post, category){
    const blogContainer = document.getElementById(`${category}-blog-container`);
    const creatorLabel = getCreatorLabel(category);
    if(!postingConditions(post, creatorLabel)) return;
    
    const blogPost = createBlogPostElement(post, creatorLabel);
    blogContainer.appendChild(blogPost);
    
    theDeleteButton(blogPost, post.id);
    theEditButton(blogPost, post.id, creatorLabel);
}

fetch("https://jsonplaceholder.typicode.com/posts")
.then(response => response.json())
.then(json => console.log(json))
.catch(error => console.error("Error fetching post", error));
