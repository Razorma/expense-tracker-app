export default function ExpenseTracker(db){
    //create a function to add expenses
    async function addExpense(expenseText,categoryId, amount,total){
        //Query to add expense
        const addQuery = `INSERT into expense (expense_text,amount,total,category_id) 
        values ($1,$2,$3,$4);
        `
        await db.none(addQuery,[expenseText,amount,total,categoryId])
    }

    //A function to get all the expenses
    async function allExpenses(){
         //Query to add select all the expenses
        const getExpensesQuery = `
        SELECT e.id, e.expense_text, e.amount, e.total, e.category_id, c.category_type
        FROM expense e
        JOIN category c ON e.category_id = c.id;
        `
        //return the array of expenses
        return await db.any(getExpensesQuery)
    }
    
    //Function to get all expeses by category
    async function expensesForCategory(categoryId){

        //query to get all the expenses by the id entered
        const getExpensesForIDQuery  = `
        SELECT * 
        FROM expense e
        JOIN category c ON e.category_id = c.id
        WHERE e.category_id = $1;
        `
        //return the array of expenses
        return await db.any(getExpensesForIDQuery,[categoryId])
    }

    //Function that gets the total for a catagory
    async function expensesTotalForCategory(categoryId){

        //query that gets the total for a catagory
        const getExpensesForIDQuery  = `
        SELECT sum(total) 
        FROM expense 
        WHERE category_id = $1;
        `
        //destructure the array
        const [results] = await db.any(getExpensesForIDQuery,[categoryId])
        //return the sum
        return results.sum
    }
    //Function to delete an expense
    async function deleteExpense(expenseId){
        //delete an expence of a certain ID
        const getExpensesForIDQuery  = `
        DELETE 
        FROM expense
        WHERE id = $1;
        `
        //pass the id to the query
         await db.any(getExpensesForIDQuery,[expenseId])
    }
    //Function to get the total for all the catagories
    async function categoryTotals(){
        //query to get the total for all the catagories
        const getTotalQuery  = `
        SELECT sum(total) 
        FROM expense;
        `

        const sum = await db.one(getTotalQuery)

        //return the sum
        return sum.sum
    }


    return{
        addExpense,
        allExpenses,
        expensesForCategory,
        deleteExpense,
        categoryTotals,
        expensesTotalForCategory
    }
}