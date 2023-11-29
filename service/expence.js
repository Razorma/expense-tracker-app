export default function ExpenseTracker(db){

    // id | category_type
//     ----+---------------
//       1 | weekly
//       2 | monthly
//       3 | weekday
//       4 | weekend
//       5 | once-off
//       6 | daily 
    async function addExpense(expenseText,categoryId, amount,total){
        const addQuery = `INSERT into expense (expense_text,amount,total,category_id) 
        values ($1,$2,$3,$4);
        `
        await db.none(addQuery,[expenseText,amount,total,categoryId])
    }
    async function allExpenses(){
        const getExpensesQuery = `
        SELECT * 
        FROM expense e
        JOIN category c ON e.category_id = c.id;
        `
        return await db.any(getExpensesQuery)
    }
    
    async function expensesForCategory(categoryId){
        const getExpensesForIDQuery  = `
        SELECT * 
        FROM expense e
        JOIN category c ON e.category_id = c.id
        WHERE e.category_id = $1;
        `
        return await db.any(getExpensesForIDQuery,[categoryId])
    }

    async function deleteExpense(expenseId){
        const getExpensesForIDQuery  = `
        DELETE 
        FROM expense
        WHERE id = $1;
        `
         await db.any(getExpensesForIDQuery,[expenseId])
    }
    async function categoryTotals(){
        const getTotalQuery  = `
        SELECT sum(total) 
        FROM expense;
        `
        const sum = await db.one(getTotalQuery)
        return sum.sum
    }

    // console.log(await addExpense("Rent",4, 1300.00,1300.00))
    // console.log(await allExpenses())
    // console.log(await deleteExpense(1))
    // console.log(await allExpenses())
    // console.log(await categoryTotals())
    //  console.log(await expensesForCategory(4))


    return{
        addExpense,
        allExpenses,
        expensesForCategory,
        deleteExpense,
        categoryTotals
    }
}