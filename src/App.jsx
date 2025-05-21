import './App.css'
import { useState, useEffect } from 'react';
import Login from './Login';

const API_BASE = 'http://localhost:8081/rest/room';

function App() {
  const [userCert, setUserCert] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomId: '', roomName: '', roomSize: '' });
  const [isEditing, setIsEditing] = useState(false);

  
  useEffect(() => {
    if (userCert) {
      fetchRooms();
    }
  }, [userCert]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: 'include' });
      const data = await res.json();
      setRooms(data.data);
    } catch (err) {
      alert('取得房間資料失敗: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (room) => {
    setForm(room);
    setIsEditing(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm(`確定要刪除房號 ${roomId} 嗎？`)) return;

    try {
      const res = await fetch(`${API_BASE}/${roomId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('刪除失敗');
      fetchRooms();
    } catch (err) {
      alert('刪除失敗: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        roomId: parseInt(form.roomId),
        roomSize: parseInt(form.roomSize)
      };

      const res = await fetch(
        isEditing ? `${API_BASE}/${payload.roomId}` : API_BASE,
        {
          method: isEditing ? 'PUT' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error('回應失敗');
      alert(isEditing ? '更新成功' : '新增成功');
      setForm({ roomId: '', roomName: '', roomSize: '' });
      setIsEditing(false);
      fetchRooms();
    } catch (err) {
      alert('表單送出失敗: ' + err.message);
    }
  };
  const clearform = () => {
    setForm({ roomId: '', roomName: '', roomSize: '' })
  }
  
  if (!userCert) {
    return <Login onLoginSuccess={setUserCert} />;
  }
  const handleLogout = async () => {
  await fetch("http://localhost:8081/rest/logout", {
    method: "GET",
    credentials: "include"
  });
  setUserCert(null); // 清除前端登入狀態
};


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      
      <p>👋 歡迎，{userCert.username}({userCert.role})</p>
      <button onClick={handleLogout}>登出</button>


      <h1>房間管理系統</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <fieldset>
          <legend>{isEditing ? '編輯房間' : '新增房間'}</legend>
          <div>
            <label>房號：</label>
            <input
              type="number"
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              required
              disabled={isEditing} // 編輯時房號不可改
            />
          </div>
          <div>
            <label>名稱：</label>
            <input
              type="text"
              name="roomName"
              value={form.roomName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>人數：</label>
            <input
              type="number"
              name="roomSize"
              value={form.roomSize}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{isEditing ? '更新房間' : '新增房間'}</button>
          {isEditing && <button type='button' onClick={clearform}>取消編輯</button>}
        </fieldset>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>房號</th>
            <th>名稱</th>
            <th>人數</th>
            <th>編輯</th>
            <th>刪除</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.roomName}</td>
              <td>{room.roomSize}</td>
              <td>
                <button type="button" onClick={() => handleEdit(room)}>編輯</button>
              </td>
              <td>
                <button type="button" onClick={() => handleDelete(room.roomId)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
