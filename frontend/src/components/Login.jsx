import {useState} from 'react';
import {login} from '../auth';

export default function Login({onLogin, onSwitch}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async ()=>{
        const res = await login(email, password);

        if (!res.access_token){
            return alert("Invalid credentials");
        }
        localStorage.setItem('token', res.access_token);
        onLogin();
    };
    return (
        <div>
        <h2>Login</h2>
        <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
        />
        <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p onClick={onSwitch} style={{cursor: 'pointer'}}>
            Don't have an account? Sign up here.
        </p>
        </div>
    )
}