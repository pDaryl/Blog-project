document.querySelectorAll(".submit-btn").forEach(button => {  // get access to all of the submit buttons on each HTML page and loop through them.
button.addEventListener("click", function(){  // set the click event listener for each button
    const category = this.getAttribute("data-category"); // use getAttribute to retrieve the value of the data-category attribute from the button. this is how the program will know which category to assign the button to when it is clicked since my code is generalized to work on all pages. 
    //  // the keyword this is referring to the button that is clicked bc it is inside of an event listener for the button.

    const blogData = {  // create an object that will have fields for each part of the post. 
        title: document.getElementById("title").value, 
        creator: document.getElementById("creator").value, 
        name: document.getElementById("name").value, 
        textArea: document.getElementById("textarea").value,
        category: category // i am incudig the category here so that when i send this data to the API it knows which category the blog post belongs to. without it i wouldnt be able to distinguish the difference for the post category.
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {  // use fetch with the API address so that i can use the API's tools 
        method: "POST",  // this will be a POST so specify the method
        headers: { 
            'Content-type': `application/json; charset=UTF-8`, // use the header to specify the the formatting 
        }, 
        body: JSON.stringify(blogData) // turn the blog data into JSON format 
    })
    .then(response => response.json()) // use .then to get the data from the input fields and parse it into json format
    .then(json => {console.log(json); // log the json response to the console 
        
        blogData.id = json.id; // each time i use the POST method the API assigns a new ID to the post so doing this allows me to use the post.ID for displaying and deleting the post. 

        displayPosts(blogData, category); // call the displayPosts function 

        document.getElementById("title").value = ''; // clear the values for all input fields
        document.getElementById("creator").value = '';
        document.getElementById("name").value = '';
        document.getElementById("textarea").value = '';
    })
    .catch((error) => console.error(`Error posting data`, error)); // use a catch block to see what error may occurr if any.
});
});


function displayPosts(post, category){ // create the display post func with a parameter for the post and category
    const blogContainer = document.getElementById(`${category}-blog-container`); // store the element for the blog container in a variable for later use.

    const blogPost = document.createElement("div"); // creating a div element stored in the variable blogPost 

    // generalize the creator label for which ever is needed per which blog catergory i am currenly on. 
    let creatorLabel = "Author";
    if(category === "music"){
        creatorLabel = "Artist";
    } else if(category === "movie"){
        creatorLabel = "Director";
    }

    // set conditions for the length of what each input field needs and alerting the user
    if(post.title.length <= 4){
        alert(`The title of the book needs to be longer than 4 characters.`);
    } else if(post.creator.length <= 4){
        alert(`The ${creatorLabel} name needs to be longer than 4 characters.`);
    } else if(post.name.length <= 2){
        alert(`Your name needs to be longer than 2 characters.`);
    } else if(post.textArea.length <= 30){
        alert(`Your blog post must have more than 30 characters.`);
    }else{
   
   
        blogPost.id = `post-${post.id}`; // assigns a unique ID to each posts DIV. making it easier to locate and remove specific posts. 
   
        blogPost.innerHTML =  // manipulate the blogPost HTML with p tags and whatever else i might need to make the blogPost post what i want.
    `  <div class="post" > <p><strong> Title: ${post.title}</strong></p>
    <p><strong> ${creatorLabel}: ${post.creator}</strong></p>
    <p><strong>Post Written By: ${post.name}</strong></p>
    <p>${post.textArea}</p> 
    <button type="text" class="delete-btn" data-id="${post.id}" >Delete</button>  
    <button type="text" class="edit-btn" data-id="${post.id}" >Edit</button>  
    </div>`  // dynamically created a delete and edit button that appears with each post to make the deletion or updating of the post easier 

    blogContainer.appendChild(blogPost); // append the blogPost to the blogcontainer which is where my posts will go. 

    const deleteButton = blogPost.querySelector(".delete-btn") // access the delete button and store it in a variable
        deleteButton.addEventListener("click", function(){ // create an event listener for the delete button
    const postId = this.dataset.id; // dataset.id get the value of the data attribute from the button the same way as getAttribute. 
    // this keyword is refering to the delete button that was clicked.
    
        
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, { // create the fetch to get the value of what i will be deleting. i use /postId here so that i delete the post by the specified postId
        method: "DELETE",  // the request method
    })
    .then(response => { // the reponse here is the HTTP response from the Fetch request. 
        if(response.ok){ // if the response in a 'successful' range then the response.ok will be true
            console.log(`Post ${postId} deleted successfully!`); // log a successfully deletion
            blogPost.remove(); // remove the blogPost 
        }
    })
    .catch(error => console.error(`error deleting data`, error)); // use a catch block to log the error if one occurrs. 
        })
    }

    const editButton = blogPost.querySelector(".edit-btn") // get access to the edit button
        editButton.addEventListener("click", function(){ // add an event listener for the edit button
            const postId = this.dataset.id; // get the value of the button's id from its data attribute. 
            console.log("editing post", postId); // log the postID, this is mostly to test if the event handler is working.

            //get access to the different areas of the blog i want to be able to edit and store them in a variable for later use. 
            const postTitle = blogPost.querySelector("p strong"); // using query selector allows me to access the precise position of what i want to edit.
            const postCreator = blogPost.querySelector("p:nth-of-type(2) strong"); // the "p:nth-of-type() allows me to be even more precise. pretty much like i am using indexing to get the postion i am editing."
            const postName = blogPost.querySelector("p:nth-of-type(3) strong");
            const postTextArea = blogPost.querySelector("p:nth-of-type(4)");

            //create input fields and a text area for each field i want to update or have access to update. 
            postTitle.innerHTML = `<input type="text" value="${postTitle.textContent.replace('Title: ', '')}"/>`;
            postCreator.innerHTML = `<input type="text" value="${postCreator.textContent.replace(creatorLabel + ': ', '')}"/>`;
            postName.innerHTML = `<input type="text" value="${postName.textContent.replace('Post Written By: ', '')}" />`;
            postTextArea.innerHTML = `<textarea> ${postTextArea.textContent} </textarea>`; // Text areas need their content inside the tags, unlike input fields that use the "value" attribute.

            const saveButton = document.createElement("button"); // create a save button 
            saveButton.textContent = "Save Changes"; // change the text inside of the button to be whatever i want it, in this case "save changes"
           const editBtn = blogPost.querySelector(".edit-btn"); // store the edit button as so for later use 
            editBtn.replaceWith(saveButton); // set the edit button to be replaced with the savebutton. 

            // remember everything between here and the edit button event listener takes place when the edit button is clicked.


            // the save button event executes once the save button is clicked.
            saveButton.addEventListener("click", function(){ //  create an event for the save button

                // get the new value of each field and store it in a variable. 
                const updatedTitle =  postTitle.querySelector("input").value;
                const updatedCreator = postCreator.querySelector("input").value;
                const updatedName = postName.querySelector("input").value;
                const updatedTextArea = postTextArea.querySelector("textarea").value;


                // send the updated data to the server using the patch request. 
                fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, { // create the PATCH request 
                    method: "PATCH",  // specify the method
                    headers: {
                         'Content-type': `application/json; charset=UTF-8`,
                    }, 
                    body: JSON.stringify({ // convert the updated daata to JSON string
                        title: updatedTitle, 
                        creator: updatedCreator, 
                        name: updatedName,
                        textArea: updatedTextArea,
                    })  
                })
                .then(response => response.json()) // get the response from the server and parse the data into json format 
                .then(updatedPost => { // once the response is parsed, execute the following. 
                    console.log(`Post successfully updated`, updatedPost) // log the successful updatedPost 


                    //update the DOM with the new values of each field 
                    postTitle.innerHTML = `Title: ${updatedPost.title}`; 
                    postCreator.innerHTML = `${creatorLabel}: ${updatedPost.creator}`;
                    postName.innerHTML = `Post Written By: ${updatedPost.name}`;
                    postTextArea.innerHTML = updatedPost.textArea;

                    saveButton.replaceWith(editBtn); // replace the save button with the original edit button
                })
                .catch(error => console.error(`Error updating post`, error)); // use a catch block in case of any errors 
            })
        })
    };







fetch('https://jsonplaceholder.typicode.com/posts') // this fetch statement is a GET request. it will show the new post in each individual session, and the posts that are already stored in the fake API. 
.then(response => response.json()) // i could create a data structure, like an array, to store the posts locally and have them posted to the blog container for each time the page is refreshed or reloaded. 
.then(json => { 
    console.log(json) 
  /* json.forEach(post => {                 // the section here is how i would GET the posts inside of the API. 
        const postDiv = document.createElement("div"); 
        postDiv.innerHTML = 
        `    <p><strong>${post.title}</strong></p>
        <p>${post.body}</p> 
        <button type="text" class="delete-btn" data-id="${post.id}" >Delete</button>`; // note: the delete button doesnt work on these posts. 

        document.body.appendChild(postDiv);
    })*/
})
.catch(error => console.error(`Error fetching post`, error)); // catch block for errors with the GET request. 
