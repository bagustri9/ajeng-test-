import './App.css';
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
      <div className='col-12 shadow d-flex justify-content-between px-4 py-2' style={{ height: 120, fontSize:24 }}>
        <div className='my-auto'>
          Logo
        </div>
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
