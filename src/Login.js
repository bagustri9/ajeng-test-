import './Login.css';
import CustomInput from './components/CustomInput';
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData);
        console.log(values);
        if (values.email == "admin@gmail.com" && values.password == "admin123") {
            localStorage.setItem('isAdmin', true);
        } else {
            localStorage.setItem('isAdmin', false);
        }
        navigate("/")
    };

    return (
        <div className='col-12 d-flex' style={{ height: '100vh' }}>
            <div className='col-3 mx-auto my-auto'>
                <form onSubmit={handleSubmit}>
                    <h2 className='text-center mb-4'>Logo</h2>
                    <h3>Login</h3>
                    <CustomInput label="Email"
                        type="email"
                        name='email'
                        required={true} />
                    <CustomInput label="Password"
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
                </form>
            </div>
        </div>
    );
}

export default Login;
