var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require('mongoose');
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var Campground          = require("./models/campgrounds");
var Comment             = require("./models/comment");
var User                = require("./models/user");
var seedDB              = require("./seed");
seedDB();
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/yelp_camp_v6';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology: true  });


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret:"gold",
   resave: false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   next();
});  

//LANDING- landing page campgrounds

app.get("/",function(req,res){
  res.render("landing");
});
//CAMPGROUNDS- show all campgrounds
app.get("/campgrounds",function(req,res)
{
   Campground.find({},function(err,campgrounds){
      if(err){
         console.log(err);
      } else{  
        
        res.render("campground/index",{campgnd:campgrounds, currentUser :req.user});
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
//NEW- crearte new campground
app.get("/campgrounds/new",function(req,res){

   res.render("campground/new");
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
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,camp){
      if(err){
         console.log(campground);
      }else{
         res.render("comments/new", {campground :camp});
      }
   });
});
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
//==============
//Auth routes
//==============

//Show register form
app.get("/register",function(req,res){
   res.render("register");
});
app.post("/register",function(req,res){
  var newUser= new User({username: req.body.username});
  User.register(newUser,req.body.password,function(err,user){
     if(err){
        console.log(err);
        return res.redirect("/register");
     }
     passport.authenticate("local")(req,res,function(){
        res.redirect("/campgrounds");
     });
  });
});
//Show- Login Page
app.get("/login",function(req,res){
   res.render("login");
});

 app.post("/login", passport.authenticate("local",
    {
       successRedirect:"/campgrounds",
       failureRedirect: "/login"
    }),function(req,res){
    }); 
//Logic route
app.get("/logout",function(req,res){
   req.logOut();
   res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}
app.listen(3000,function(){
console.log("running");
});