const form = document.querySelector('#search-form');
const message = document.querySelector('#msg');
const table = document.querySelector('#results > tbody');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const { query, submit } = e.target.elements;
  query.disabled = true
  submit.disabled = true
  message.innerText = 'Loading...';

  const res = await fetch('/search', {
    method: 'SEARCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.value }),
  });

  table.innerHTML = '';
  if (res.status == 200) {
    const { success, msg, results } = await res.json();
    message.innerText = msg;
    if (success) {
      for (const result of results) {
        const { name, color } = result;
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const colorCell = row.insertCell();
        nameCell.innerText = name;
        colorCell.innerText = color;
      }
    }
  } else {
    message.innerText = 'Unknown error';
  }

  query.disabled = false
  submit.disabled = false
});