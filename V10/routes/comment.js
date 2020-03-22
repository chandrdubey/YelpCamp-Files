var express= require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//COMMENT-routes

//Comment New
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,camp){
       if(err){
          console.log(campground);
       }else{
          res.render("comments/new", {campground :camp});
       }
    });
 });
 //Comment Create
 router.post("/",middleware.isLoggedIn,function(req,res){
    //Lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
       if(err){
          console.log(err);
       }else{
         Comment.create(req.body.comment, function(err,comment){
    //        console.log("New User:"+ req.user.username);
            comment.author.id=req.user._id;
            comment.author.username=req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            console.log(comment); 
            res.redirect("/campgrounds/"+ campground._id);
         });
       }
    });
    //creat new comment
    //connect new comment to compgrounds
    //ridirect campground show page 
 });

 //Comments-> Edit Routes
 router.get("/:comment_id/edit",middleware.CommentOwnerShip,function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
       if(err){
          console.log(err);
          res.redirect("back");
       }else{
         res.render("comments/edit",{campground_id:req.params.id, comment : foundComment});
       }
    });      
 });
 //Comment->Update Routes
 router.put("/:comment_id",middleware.CommentOwnerShip ,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
          res.redirect("back");
       }else{
          res.redirect("/campgrounds/"+req.params.id);
       }
    });
 });
 // Comment-> Destroy Routes
 router.delete("/:comment_id",middleware.CommentOwnerShip,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
          res.redirect("back");
       }else{
          res.redirect("/campgrounds/"+ req.params.id);
       }
    });
 });
 

 
 module.exports=router;