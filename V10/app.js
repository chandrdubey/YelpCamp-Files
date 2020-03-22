var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require('mongoose');
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var methodOverride      = require("method-override"); 
var Campground          = require("./models/campgrounds");
var Comment             = require("./models/comment");
var User                = require("./models/user");
var seedDB              = require("./seed");

var commentRoutes=require("./routes/comment"),
    campgroundRoutes=require("./routes/campground"),
    indexRoutes =require("./routes/index");
//seedDB();
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/yelp_camp_v6';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology: true  });


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));

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
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
console.log("running");
});