var express= require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
  //CAMPGROUNDS- show all campgrounds
  router.get("/",function(req,res)
  {
     Campground.find({},function(err,campgrounds){
        if(err){
           console.log(err);
        } else{  
          
          res.render("campground/index",{campgnd:campgrounds, currentUser :req.user});
        }
     });
  });
  //POST- Campground
  router.post("/",middleware.isLoggedIn,function(req,res){
      var name= req.body.name;
      var image=req.body.image;
      var desc=req.body.description;
      var author={
         id: req.user._id,
         username: req.user.username
      }
      var newcamp={name: name, image: image, description:desc,author:author}
      console.log(req.user);
      Campground.create(newcamp, function(err, newca){
         if(err)
         {
            console.log(err);
         } else{
            console.log(newca);
           res.redirect("/campgrounds");
         }
      });
  });
  //NEW- crearte new campground
  router.get("/new",middleware.isLoggedIn,function(req,res){
  
     res.render("campground/new");
  });
  //show-more info about the campgrounds
  
  router.get("/:id",function(req,res){
     Campground.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
           console.log(err);
        }else{
           console.log(found);
           res.render("campground/show",{campground:found});
        }
     });
  });
  //EDIT->Campground routes
  router.get("/:id/edit",middleware.CampgroundOwnerShip,function(req,res){
   Campground.findById(req.params.id,function(err, found){
      res.render("campground/edit",{campground:found});
   });    
  });
  //UPDATE->Campground routes
  router.put("/:id",middleware.CampgroundOwnerShip,function(req,res){
     Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedcapm){
        if(err){
           res.redirect("/campgrounds");
        }else{
           res.redirect("/campgrounds/"+req.params.id);
        }
     });
  });
  //DESTROY->Campground routes
  router.delete("/:id",middleware.CampgroundOwnerShip,function(req,res){
     Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
           res.redirect("/campgrounds");
        }else{
           res.redirect("/campgrounds");
        }
     });
  });
  module.exports=router;