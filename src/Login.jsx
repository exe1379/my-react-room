import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8081/rest/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert('登入失敗: ' + data);
        return;
      }

      onLoginSuccess(data); // 回傳登入成功的 user 資訊
    } catch (err) {
      alert('錯誤：' + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>請先登入</h2>
      <input placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} />
      <br />
      <input placeholder="密碼" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>登入</button>
    </div>
  );
}

export default Login;
