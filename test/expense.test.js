
import assert from 'assert';
import ExpenseTracker from '../service/expence.js';
import pgPromise from 'pg-promise';
import dotenv from "dotenv"
dotenv.config()

// TODO configure this to work.
const connectionString = process.env.DATABASE_URL_TEST ;


const pgp = pgPromise();
const db = pgp({ connectionString});

const expenseTracker = ExpenseTracker(db);
// id | category_type
//     ----+---------------
//       1 | weekly
//       2 | monthly
//       3 | weekday
//       4 | weekend
//       5 | once-off
//       6 | daily 
describe("The Expense Tracker Function", function () {
    this.timeout(8000);
    beforeEach(async function () {
        await db.none(`DELETE FROM expense;`);
        await db.none(`ALTER SEQUENCE expense_id_seq RESTART WITH 1;`);
    });

    it("should be able to add an expense", async function () {
        const expenseText = 'Taxi';
        const categoryId = 1;
        const amount = 1200.00;
        const total = 1200.00;
        
        await expenseTracker.addExpense(expenseText,categoryId, amount,total)

        const expenses = await expenseTracker.allExpenses()
        // `SELECT * FROM expense;`
        // const checkTable = await db.any(checkTableQuery)
     
        assert.strictEqual(expenses.length, 1);
    });


    it("should be able to get expense for a catagory", async function () {
        const expenseText = 'Taxi';
        const categoryId = 1;
        const amount = 1200.00;
        const total = 1200.00;

        const expenseText2 = 'coffee';
        const categoryId2 = 4;
        const amount2 = 120.00;
        const total2 = 120.00;
        
        await expenseTracker.addExpense(expenseText,categoryId, amount,total)
        await expenseTracker.addExpense(expenseText2,categoryId2, amount2,total2)


        const [catagoryExpense] = await expenseTracker.expensesForCategory(4)

     
        assert.equal(catagoryExpense.expense_text, 'coffee');
        assert.equal(catagoryExpense.amount, '120');
        assert.equal(catagoryExpense.category_id, 4);
           
    });
    it("should be able to delete an expense", async function () {
        const expenseText = 'Taxi';
        const categoryId = 1;
        const amount = 1200.00;
        const total = 1200.00;

        const expenseText2 = 'coffee';
        const categoryId2 = 4;
        const amount2 = 120.00;
        const total2 = 120.00;
        
        await expenseTracker.addExpense(expenseText,categoryId, amount,total)
        await expenseTracker.addExpense(expenseText2,categoryId2, amount2,total2)


        await expenseTracker.deleteExpense(1)

     
        const expenses = await expenseTracker.allExpenses()
     
        assert.strictEqual(expenses.length, 1);
           
    });

    it("should be able to get the total for all the catagories", async function () {
        const expenseText = 'Taxi';
        const categoryId = 1;
        const amount = 1200.00;
        const total = 1200.00;

        const expenseText2 = 'coffee';
        const categoryId2 = 4;
        const amount2 = 120.00;
        const total2 = 120.00;
        
        await expenseTracker.addExpense(expenseText,categoryId, amount,total)
        await expenseTracker.addExpense(expenseText2,categoryId2, amount2,total2)

        const totals = await expenseTracker.categoryTotals()
     
        assert.strictEqual(totals, '1320');
           
    });

    

    after(function () {
        db.$pool.end()
    });

});