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
      //initalise a value for the empty expense
       let money = 0

       //get all the money from the database function
        const Daily = await expense.expensesTotalForCategory(6) ||money.toFixed(2)        
        const Weekly = await expense.expensesTotalForCategory(1) ||money.toFixed(2) 
        const Weekday = await expense.expensesTotalForCategory(3) ||money.toFixed(2) 
        const Weekend = await expense.expensesTotalForCategory(4) ||money.toFixed(2) 
        const OnceOff = await expense.expensesTotalForCategory(5) ||money.toFixed(2) 
        const Monthly = await expense.expensesTotalForCategory(2) ||money.toFixed(2) 


        //get the total for all the days
        const Total = await expense.categoryTotals() || money.toFixed(2)

        //render the home with the data
        res.render('home',{ 
          Total,
          daily:Daily,
          weekly:Weekly, 
          weekday:Weekday, 
          weekend:Weekend,
          onceOff:OnceOff,
          monthly:Monthly
        })
    } catch (error) {
        console.log(error.message)
        res.render('home')
    }
    
})
app.post('/',async function(req,res,next){
  //get the input data from the body
    const {description,amount,cadegory} = req.body
    try {
      //get the addExpense function to add expenses
      await expense.addExpense(description,parseFloat(cadegory), amount,amount)
    } catch (error) {
      console.log(error)
    }
    
    res.redirect('/')
})

app.get('/expenses', async function (req, res, next) {
 
  try {
    //all the expenses for the all expense function
   const allExpenses = await expense.allExpenses()
    res.render('expenses', {allExpenses })
  } catch (error) {
    console.log(error.message)
    res.render('expenses')
  }


})

app.post('/expenses', async function (req, res, next) {
  //get the id from the body
  const expenseId = req.body.expenseId
 
  try { 
    //get delete expense function to pass the is being deleted
    await expense.deleteExpense(expenseId)
    res.redirect('/expenses')
  } catch (error) {
    console.log(error.message)
    res.redirect('expenses')
  }


})








const PORT = process.env.PORT || 3014;

app.listen(PORT, function(){
  console.log(`App listening on localhost:${PORT}`);
});