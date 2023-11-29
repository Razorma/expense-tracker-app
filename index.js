import express  from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import pgPromise from "pg-promise";
import flash from "express-flash";
import session from "express-session";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import ExpenseTracker from "./service/expence.js";
dotenv.config();


const app = express();
const pgp = pgPromise();

const connectionString = process.env.DATABASE_URL 

const db = pgp({ connectionString});

const expense = ExpenseTracker(db)

app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());







app.get('/', async function(req,res,next){
    try {
        // id | category_type
//     ----+---------------
//       1 | weekly
//       2 | monthly
//       3 | weekday
//       4 | weekend
//       5 | once-off
//       6 | daily 
        let money = 0
        const Daily = await expense.expensesForCategory(6)         
        const Weekly = await expense.expensesForCategory(1) 
        const Weekday = await expense.expensesForCategory(3) 
        const Weekend = await expense.expensesForCategory(4) 
        const OnceOff = await expense.expensesForCategory(5) 
        const Monthly = await expense.expensesForCategory(2) 
        console.log("lolo")
        const Total = await expense.categoryTotals() || money.toFixed(2)
        res.render('home',{ Total,Daily,Weekly, Weekday, Weekend,OnceOff,Monthly})
    } catch (error) {
        console.log(error.message)
        res.render('home')
    }
    
})
app.post('/',function(req,res,next){
    const {} = req.body
    res.render('home')
})









const PORT = process.env.PORT || 3014;

app.listen(PORT, function(){
  console.log(`App listening on localhost:${PORT}`);
});