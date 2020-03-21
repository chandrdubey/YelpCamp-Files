var express=require("express");
var app=express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
var campground=[ 
   { name: "hilltown", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/backpacking-camping.jpg" },
   { name: "darkplace", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/survival-camping-1.jpg" },
   { name: "forbidden thing", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/car-camping.jpg" },
   { name: "hilltown", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/backpacking-camping.jpg" },
   { name: "darkplace", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/survival-camping-1.jpg" },
   { name: "forbidden thing", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/car-camping.jpg" },
   { name: "hilltown", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/backpacking-camping.jpg" },
   { name: "darkplace", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/survival-camping-1.jpg" },
   { name: "forbidden thing", image:"https://www.survivaltechshop.com/wp-content/uploads/2019/05/car-camping.jpg" }
];
app.get("/",function(req,res){
  res.render("landing");
});
app.get("/campgrounds",function(req,res)
{
 
 res.render("campground",{campgnd:campground});
});

app.post("/campgrounds",function(req,res){
    var name= req.body.name;
    var image=req.body.image;
    var newcamp={name: name, image: image}
    campground.push(newcamp);
    res.redirect("/campgrounds");
});
app.get("/campgrounds/new",function(req,res){
   res.render("new.ejs");
});

app.listen(3000,function(){
console.log("running");
});