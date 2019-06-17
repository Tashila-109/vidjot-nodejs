const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')

const app = express();

// load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport);

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

// Express Session middleware
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title
    });
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});


// Use Routes
app.use('/ideas', ideas);
app.use('/users', users)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Sever started on port ${port}`);
});