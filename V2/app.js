var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/yelp_camp';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology: true  });
//Schema
var campgroundSchema= new mongoose.Schema({
   name: String,
  image: String,
  description: String
});
var Campground= mongoose.model("Campground", campgroundSchema);
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

app.get("/",function(req,res){
  res.render("landing");
});
app.get("/campgrounds",function(req,res)
{
   Campground.find({},function(err,campgrounds){
      if(err){
         console.log(err);
      } else{  
        res.render("index",{campgnd:campgrounds});
      }
   });
});

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
app.get("/campgrounds/new",function(req,res){
   res.render("new.ejs");
});
app.get("/campgrounds/:id",function(req,res){
   Campground.findById(req.params.id,function(err,found){
      if(err){
         console.log(err);
      }else{
         res.render("show",{campground:found});
      }
   });
});

app.listen(3000,function(){
console.log("running");
});