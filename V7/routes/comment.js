var express= require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
//COMMENT-routes

//Comment New
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,camp){
       if(err){
          console.log(campground);
       }else{
          res.render("comments/new", {campground :camp});
       }
    });
 });
 //Comment Create
 router.post("/",isLoggedIn,function(req,res){
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
 //middleware
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
 }
 module.exports=router;