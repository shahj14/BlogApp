var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/rest_blog");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2550&q=80",
//   body: "Info for the test blog"
// })
//INDEX
app.get("/", function(req,res){
  res.redirect("blogs");
})
//INDEX
app.get("/blogs", function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    }else {
      res.render("index", {blogs: blogs});
    }
  })
})
//NEW
app.get("/blogs/new", function(req,res){
  res.render("new");
})
//CREATE
app.post("/blogs", function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err,newBlog){
    if(err){
      res.render("new");
    }else {
      res.redirect("/blogs");
    }
  })
})

//SHOW
app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      alert("Error Occured");
    }else {
      res.render("show", {blog: blog});
    }
  })
})
//EDIT
app.get("/blogs/:id/edit", function(req,res){
  Blog.findById(req.params.id, function(err,blog){
    if(err){
      console.log(err);
    }else {
      res.render("edit",{curBlog: blog})
    }
  })
})
//UPDATE
app.put("/blogs/:id", function(req,res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
    if(err){
      res.redirect("/");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  })
})
//DELETE
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs");
    }
  })
})

app.listen(3000, function(){
  console.log("Blog App Running")
})
