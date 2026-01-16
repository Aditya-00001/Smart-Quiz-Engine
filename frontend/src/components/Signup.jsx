import {useState} from 'react';
import {signup} from '../auth'

export default function Signup({onSwitch}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async ()=>{
        const res = await signup(email, password);

        if (res.error){
            alert(res.error);
        }
        alert("Signup successful! Please log in.");
        onSwitch();
    };
    return (
        <div>
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