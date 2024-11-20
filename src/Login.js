import './Login.css';
import CustomInput from './components/CustomInput';
import { useNavigate } from "react-router-dom";
import CustomDB from './components/CustomDB';
import { useState } from 'react';
import logo from './assets/logo.png'

function Login() {

    const navigate = useNavigate();
    const db = CustomDB();
    const [error, setError] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData);
        var loginData = db.readAll("users").find(x => x.email == values.email && x.password == values.password)
        if (loginData == undefined) {
            setError(true);
            return
        }
        localStorage.setItem('loginId', loginData.id);

        navigate("/")
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='col-12 d-flex' style={{ height: '100vh' }}>
                <div className='col-3 mx-auto my-auto d-flex flex-column'>
                    <img height="140" className='mx-auto mb-4' src={logo} />
                    <h3 className='mt-3'>Login</h3>
                    <CustomInput label="Email"
                        error={error}
                        errorText="Wrong authentication! Please check your email"
                        type="email"
                        name='email'
                        required={true} />
                    <CustomInput label="Password"
                        error={error}
                        errorText="Wrong authentication! Please check your password"
                        type="password"
                        name='password'
                        required={true} />
                    <div className='d-flex justify-content-between mt-2 mb-3' style={{ fontSize: 14 }}>
                        <div className='d-flex'>
                            <input name='rememberMe' type='checkbox' className='custom-checkbox my-auto' />
                            <span className='ms-1 my-auto'>
                                Remember me
                            </span>
                        </div>
                        <a href='#' style={{ textDecoration: 'none' }}>Lupa Password</a>
                    </div>
                    <button type='submit' className='btn bg-merah-gelap text-white col-12'>Login</button>
                </div>
            </div>
        </form>
    );
}

export default Login;
