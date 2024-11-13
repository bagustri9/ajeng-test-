import './Login.css';
import { Outlet } from "react-router-dom";

function Login() {

    return (
        <div className='col-12 d-flex' style={{ height: '100vh' }}>
            <div className='col-3 mx-auto my-auto'>
                <h2 className='text-center mb-4'>Logo</h2>
                <h3>Login</h3>
                <div className='custom-form-group'>
                    <label className='custom-label'>Email</label>
                    <input className='col-12 custom-input-text' type='text' />
                </div>
            </div>
        </div>
    );
}

export default Login;
