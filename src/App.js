import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    division: "Personal",
    description: ""
  });

  const BASE_URL = "http://localhost:8080/api/transactions";

  const loadTransactions = async () => {
    const res = await fetch(BASE_URL);
    setTransactions(await res.json());
  };

  const loadSummary = async () => {
    const res = await fetch(BASE_URL + "/summary");
    setSummary(await res.json());
  };

  useEffect(() => {
    loadTransactions();
    loadSummary();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({
      amount: "",
      type: "expense",
      category: "",
      division: "Personal",
      description: ""
    });
    loadTransactions();
    loadSummary();
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Money Manager</h1>
        <p>Track your income and expenses easily</p>
      </div>

      <div className="stats">
        <div>
          <span>Income</span>
          <h3>₹{summary.income}</h3>
        </div>
        <div>
          <span>Expense</span>
          <h3>₹{summary.expense}</h3>
        </div>
        <div>
          <span>Balance</span>
          <h3>₹{summary.balance}</h3>
        </div>
      </div>

      <div className="glass">
        <form onSubmit={handleSubmit}>
          <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <select name="division" value={form.division} onChange={handleChange}>
            <option>Personal</option>
            <option>Office</option>
          </select>
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button>Add Transaction</button>
        </form>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Division</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.amount}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>{t.division}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
