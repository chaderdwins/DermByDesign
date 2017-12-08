//App Config
var bodyParser      = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    express             = require("express"),
    flash        = require("connect-flash"),
    expressSanitizer    = require("express-sanitizer"),
    passport              = require("passport"),
    app                 = express(),
    User                  = require("./models/users"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

//
mongoose.connect("mongodb://kingBee:PhyAZ39V!@ds033196.mlab.com:33196/derm_by_design");
//mongoose.connect("mongodb://localhost/restful_blog_app"); //local DB
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


//================================
//    Mongoose Schema Config
//================================
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema);


//======================
//        Routes
//======================

//Index Route

app.get("/", function(req,res){
   res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if (err){
            console.log("ERROR!");
        }else {
            res.render("index", {blogs: blogs});
        }
    }).limit(3).sort({created: -1});
    
});

//NEW Route

app.get("/blogs/new", isLoggedIn, function(req, res) {
    res.render("new");
});

//CREATE Route

app.post("/blogs", isLoggedIn, function(req,res){
   //create blog 
/*   req.body.blog.body = req.sanitize(req.body.blog.body);*/
   Blog.create(req.body.blog, function(err,newBlog){
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   });

});

//SHOW Route
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", isLoggedIn, function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", isLoggedIn, function(req,res){
/*    req.body.blog.body = req.sanitize(req.body.blog.body);*/
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", isLoggedIn, function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
//===========================
//  Authorization Routes
//===========================

// Show Sign Up Form
app.get("/register", isLoggedIn, function(req, res){
   res.render("register"); 
});

// Send Sign Up Data
app.post("/register", isLoggedIn, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("blogs/new");
        });
    });
});

// Show Login Form
app.get("/login", function(req, res){
   res.render("login"); 
});

// Send Login Data
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

// Send Logout Request
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


//======================
//      Middleware
//======================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Opening Port and Listening
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("\nServer is running");
});