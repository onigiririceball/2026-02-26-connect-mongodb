// public/index.js
window.addEventListener('DOMContentLoaded', (event) => {
    // ユーザー名をクリックしたらアラートを表示
    document.querySelectorAll('.user-name').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        alert(event.target.innerHTML);
      });
    });

    // 送信ボタンをクリックしたらユーザー名を送信
    document.querySelector('.send-button').addEventListener('click', (event) => {
        const inputValue = document.querySelector('.input-text').value;
        //alert(inputValue);
        //const element = document.createElement('li');
        fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: text }) })
    });
    
  });