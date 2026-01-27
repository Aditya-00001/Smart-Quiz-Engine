import {useState} from 'react';
import {signup} from '../auth'

export default function Signup({onSwitch}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        const res = await signup(email, password);

        if (res.error) {
            alert(res.error);
            return; // 🚨 stop here
        }

        alert("Signup successful! Please log in.");
        onSwitch();
    };
    return (
        <div className='front'>
            <h2>Signup</h2>
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
            <button onClick={handleSignup}>Signup</button>
            <p onClick={onSwitch} style={{cursor: 'pointer'}}>
                Already have an account? Log in here.
            </p>
        </div>
    );

}