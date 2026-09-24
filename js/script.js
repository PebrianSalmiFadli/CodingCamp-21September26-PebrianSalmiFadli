const form = document.getElementById('transaction-form');
const itemNameInput = document.getElementById('item-name');
const itemAmountInput = document.getElementById('item-amount');
const itemCategoryInput = document.getElementById('item-category');
const totalBalanceEl = document.getElementById('total-balance');
const transactionListEl = document.getElementById('transaction-list');
const ctx = document.getElementById('expenseChart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart;

function initChart() {
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#f43f5e', '#3b82f6', '#8b5cf6'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateUI() {
    transactionListEl.innerHTML = '';
    let total = 0;
    let categoryTotals = { Food: 0, Transport: 0, Fun: 0 };

    if (transactions.length === 0) {
        transactionListEl.innerHTML = `<li class="text-center text-xs text-slate-400 py-3">No transactions added yet.</li>`;
    }

    transactions.forEach((tx, index) => {
        total += tx.amount;
        if (categoryTotals[tx.category] !== undefined) {
            categoryTotals[tx.category] += tx.amount;
        }

        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-sm shadow-2xs";
        li.innerHTML = `
            <div>
                <span class="font-medium text-slate-700">${tx.name}</span>
                <span class="text-xs text-slate-400 block">${tx.category}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-semibold text-slate-900">$${tx.amount.toFixed(2)}</span>
                <button onclick="deleteTransaction(${index})" class="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-xs transition cursor-pointer">X</button>
            </div>
        `;
        transactionListEl.appendChild(li);
    });

    totalBalanceEl.innerText = `$${total.toFixed(2)}`;
    
    // Update Chart data
    expenseChart.data.datasets[0].data = [
        categoryTotals.Food,
        categoryTotals.Transport,
        categoryTotals.Fun
    ];
    expenseChart.update();

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const amount = parseFloat(itemAmountInput.value);
    const category = itemCategoryInput.value;

    if (!name || isNaN(amount)) return;

    transactions.push({ name, amount, category });
    itemNameInput.value = '';
    itemAmountInput.value = '';
    
    updateUI();
});

window.deleteTransaction = function(index) {
    transactions.splice(index, 1);
    updateUI();
}

initChart();
updateUI();
