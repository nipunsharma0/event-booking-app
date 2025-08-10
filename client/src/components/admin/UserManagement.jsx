import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (error) {
        addNotification('Failed to fetch users', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`); 
  };

  if (loading) {
    return <span className="loading loading-lg loading-spinner text-primary"></span>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined On</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user._id} 
              className="hover cursor-pointer" 
              onClick={() => handleUserClick(user._id)} 
            >
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? <span className="badge badge-ghost">Admin</span> : <span className="badge badge-ghost">User</span>}</td>
              <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;