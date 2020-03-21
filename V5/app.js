var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require('mongoose');
var Campground= require("./models/campgrounds");
var Comment=require("./models/comment");
var seedDB= require("./seed");
seedDB();
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/yelp_camp';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology: true  });

/* Campground.create({
   name: "darkplace", 
   image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/survival-camping-1.jpg",
   description: "this place is great to get high on mountains with the help of some good stuff"
 }, function(err,campground)
{
   if(err){
      console.log(err);
   }
   else{
      console.log(campground);
   }
});   */
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
//LANDING- landing page campgrounds

app.get("/",function(req,res){
  res.render("landing");
});
app.get("/campgrounds",function(req,res)
{
   Campground.find({},function(err,campgrounds){
      if(err){
         console.log(err);
      } else{  
        res.render("campground/index",{campgnd:campgrounds});
      }
   });
});
//CAMPGROUNDS- show all campgrounds
app.post("/campgrounds",function(req,res){
    var name= req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newcamp={name: name, image: image, description:desc}
    Campground.create(newcamp, function(err, newca){
       if(err)
       {
          console.log(err);
       } else{
         res.redirect("/campgrounds");
       }
    });
});
//NEW- crearte new campground
app.get("/campgrounds/new",function(req,res){
   res.render("compground/new");
});
//show-more info about the campgrounds

app.get("/campgrounds/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err,found){
      if(err){
         console.log(err);
      }else{
         console.log(found);
         res.render("campground/show",{campground:found});
      }
   });
});
//COMMENT-routes
app.get("/campgrounds/:id/comments/new",function(req,res){
   Campground.findById(req.params.id,function(err,camp){
      if(err){
         console.log(campground);
      }else{
         res.render("comments/new", {campground :camp});
      }
   });
});
app.post("/campgrounds/:id/comments",function(req,res){
   //Lookup campground using id
   Campground.findById(req.params.id,function(err,campground){
      if(err){
         console.log(err);
      }else{
        Comment.create(req.body.comment, function(err,comment){
           campground.comments.push(comment);
           campground.save();
           res.redirect("/campgrounds/"+ campground._id);
        });
      }
   });
   //creat new comment
   //connect new comment to compgrounds
   //ridirect campground show page 
});
   

app.listen(3000,function(){
console.log("running");
});