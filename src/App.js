import './App.css';
import { Outlet, Link } from "react-router-dom";

function App() {

  return (
    <>
      <div className='col-12 shadow d-flex justify-content-between px-4 py-2' style={{ height: 120, fontSize:24 }}>
        <Link to="/" className='my-auto'>
          Logo
        </Link>
        <div className='my-auto ps-4 d-flex' style={{ borderLeft: '1px solid #9FA3A9', height: 60, fontSize:24}}>
          <span className='my-auto'><b>Hallo</b>, Ajeng</span>
        </div>
      </div>
      <div className='p-4'>
        <Outlet />
      </div>
    </>
  );
}

export default App;
