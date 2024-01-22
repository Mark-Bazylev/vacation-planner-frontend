// import {useDispatch} from "react-redux";
import React, { useState } from "react";
import { login } from "../redux/authentication/authSlice";
import { useAppDispatch } from "../redux/hooks";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  // const dispatch=useDispatch()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userData, setUserData] = useState({});
  const dispatch = useAppDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password })).unwrap();
    setUserData(res);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <div>{JSON.stringify(userData)}</div>
    </div>
  );
};

export default LoginPage;
