
import UserSmall from "./UserSmall";
import{ getAll } from '../models/userModel'
import { useEffect, useState } from "react";

function UserList({pathname}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAll(pathname).then(users => setUsers(users));
   }, [pathname]);

  return (
    <ul>
      {users &&
        users.map((user) => {
          return (
            <li key={`userId_${user.id}`}>
              <UserSmall user={user} />
            </li>
          );
        })}
    </ul>
  );
}

export default UserList;
