import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Cards from '../Components/Cards'
import { Modal } from 'antd';
import AddIncomeModal from '../Components/Modals/addIncome';
import AddExpenseModal from '../Components/Modals/addExpense';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import moment from 'moment';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import TransactionTable from '../Components/TransactionTable';
import ChartsComponent from '../Components/Charts';
import NoTransactions from '../Components/NoTransactions';


function Dashboard() {
  const [loading,setLoading] = useState(false);
  const [transactions,setTransactions] = useState([]);
  const [user] = useAuthState(auth);        // useAuthState is a custom React hook provided by Firebase. It allows you to subscribe to changes in the user's authentication state. When the user logs in or out, or when their authentication state changes for any reason, this hook provides the updated user object and loading status.
  const [income,setIncome] = useState(0);
  const [expense,setExpenses] = useState(0);
  const [totalBalance,setTotalBalance] = useState(0);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  // const [transactions, setTransactions] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [currentBalance, setCurrentBalance] = useState(0);
  // const [income, setIncome] = useState(0);
  // const [expenses, setExpenses] = useState(0);

  // const navigate = useNavigate();

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    // setTransactions([...transactions, newTransaction]);
    // setIsExpenseModalVisible(false);
    // setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    // calculateBalance();
  }

  async function addTransaction(transaction, many) {
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } 
    catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(()=>{
    // Get all docs from a collection
    fetchTransactions();
  },[user])

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  useEffect(()=>{
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  let sortedTransactions = transactions.sort((a, b)=>{
    return new Date(a.date) - new Date(b.date);
  })

  return (
    <div>
      <Header></Header>
      {loading ? <p>Loading...</p> : <>
        <Cards
          income={income}
          expenses={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal} 
        />

        {/*----chart section ------ */}
        {transactions && transactions.length!=0 ? ( <ChartsComponent sortedTransactions={sortedTransactions}/> ) : ( <NoTransactions/> ) }

        {/* ------------------------------- */}


        {/* Add income Dialog box */}
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
 
        {/* Add expense Dialog box */}
        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        
        <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
      </>}
    </div>
  )
}

export default Dashboard