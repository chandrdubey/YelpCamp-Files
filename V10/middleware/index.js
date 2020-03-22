var Campground= require("../models/campgrounds");
var Comment   =    require("../models/comment");
var middlewareObj = {};

middlewareObj.CampgroundOwnerShip = function(req,res,next){
    if(req.isAuthenticated()){
       Campground.findById(req.params.id,function(err, found){
          if(err){
             res.redirect("back");
          }else{
            if(found.author.id.equals(req.user._id)){
             next();
            }else{
               res.redirect("back");
            }
          }
       });       
      }else{
       res.redirect("back");
    }   
 }
 middlewareObj.CommentOwnerShip =function(req,res,next){
    if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id,function(err, found){
          if(err){
             res.redirect("back");
          }else{
             // Does user own the comment?
            if(found.author.id.equals(req.user._id)){
             next();
            }else{
               res.redirect("back");
            }
          }
       });       
      }else{
       res.redirect("back");
    } 
 }

 middlewareObj.isLoggedIn= function (req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
 }

 module.exports = middlewareObj;

 