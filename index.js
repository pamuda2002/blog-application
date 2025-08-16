// Import necessary modules
import express from "express";

// Create an Express application
const app = express();
const port = 3000;

// In-memory data store for blog posts
let posts = [];
let postIdCounter = 1;

import bodyParser from "body-parser";

// Middleware setup
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.set("view engine", "ejs"); // Set EJS as the view engine

// Route to display all posts
app.get("/", (req, res) => {
  res.render("index.ejs", { postsList: posts });
});

// Route to display the new post form
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// Route to display the about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Route to display the contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Route to handle new post submissions
app.post("/posts", (req, res) => {
  const { postTitle, postContent, author } = req.body;
  if (!postTitle || !postContent) {
    return res.render("new.ejs", {
      error: "Title and content are required.",
      title: postTitle,
      content: postContent,
      author: author
    });
  }
  const newPost = {
    id: postIdCounter++,
    title: postTitle,
    content: postContent,
    author: author,
    date: new Date()
  };
  posts.push(newPost);
  res.redirect('/');
});

// Route to handle post deletion
app.post("/posts/delete/:itemId", (req, res) => {
  const postId = parseInt(req.params.itemId);
  const postIndex = posts.findIndex(post => post.id === postId);
  if(postIndex > -1){
    posts.splice(postIndex, 1);
  };
  res.redirect("/");
});

// Route to display the edit post form
app.get("/posts/edit/:id", (req, res) => {
 const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render('edit', { post: post });
  } else {
    res.redirect('/');
  }
});

// Route to handle post updates
app.post('/posts/update/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { postTitle, postContent, author } = req.body;
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.redirect('/');
  }

  if (!postTitle || !postContent) {
    const post = { id: postId, title: postTitle, content: postContent, author: author };
    return res.render('edit.ejs', {
      error: "Title and content are required.",
      post: post
    });
  }

  posts[postIndex].title = postTitle;
  posts[postIndex].content = postContent;
  posts[postIndex].author = author;
  posts[postIndex].date = new Date();
  res.redirect('/');
});

// Route to display a single post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render("post.ejs", { post: post });
  } else {
    res.redirect("/");
  }
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening on port:${port}`);
  });
}

export { app, posts };