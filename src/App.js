import './App.css';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CustomDB from './components/CustomDB';
import { motion } from "framer-motion";
import logo from './assets/logo.png'

function App() {
  const [loginId, setloginId] = useState(false);
  const [notification, setNotification] = useState([]);
  const [response, setResponse] = useState([]);
  const [rpojk, setRpojk] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const CustomToggling = React.forwardRef(({ children, onClick }, ref) => (

    <div className='mx-auto d-flex justify-content-center notif-hover' style={{ width: 40, height: 40, borderRadius: '50%' }}>
      {notification.filter(x => !x.isOpened).length > 0 ?
        <div className='d-flex' style={{ position: 'absolute', fontSize: 12, right: 0, top: -5, width: 20, height: 20, borderRadius: 5, backgroundColor: '#f66' }}>
          <span className='my-auto mx-auto text-white'>{notification.filter(x => !x.isOpened).length}</span>
        </div> : null}
      <motion.svg
        className="my-auto"
        viewBox="0 15 75 91"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <motion.path
          d="M 10 35 C 10 10 65 10 65 35 L 65 75 L 75 90 L 0 90 L 10 75 L 10 35 M 25 91 A 1 1 0 0 0 50 91"
          fill="transparent"
          stroke={notification.filter(x => !x.isOpened).length > 0 ? "#3af" : "#999"}
          strokeWidth="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, transition: { duration: 1 } }}
          strokeLinecap="round"
          strokeLinejoin="round" />
      </motion.svg>
    </div>
  ));

  useEffect(() => {
    if (localStorage.getItem("loginId") == null) {
      navigate("/login")
    } else {
      setloginId(localStorage.getItem("loginId"));
    }
    setNotification(db.readAll("notification").filter(x => x.notifFor == localStorage.getItem("loginId")));
    var rpojk = db.readAll("rpojk")
    var users = db.readAll("users")
    setRpojk(rpojk)
    setUsers(users)

    setResponse(data => {
      var response = db.readAll("responseRpojk");
      response.map(x => {
        x.rpojk = rpojk.find(y => y.id == x.rpojkId)
        x.user = users.find(y => y.id == x.instansi)
      });
      return response
    });
  }, [refresh])

  const CustomSwal = withReactContent(Swal);
  var navigate = useNavigate();
  const db = CustomDB();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      className='my-auto'
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ textDecoration: "none", color: '#666' }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  return (
    <>
      <div className='col-12 shadow d-flex justify-content-between px-4 py-2 sticky-top bg-light' style={{ height: 80, fontSize: 24 }}>
        <Link to="/" className='my-auto'>
          <img height="60" src={logo} />
        </Link>
        <div className='d-flex'>
          <div className='my-auto me-4'>
            <Dropdown onToggle={(e) => {
              if (e == false) {
                notification.map(x => {
                  x.isOpened = true;
                  db.update("notification", x.id, x);
                })
              }
            }}>
              <Dropdown.Toggle as={CustomToggling} id="dropdown-custom-components">
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notification.map((x, index) => (
                  loginId == 0 ?
                    <Dropdown.Item key={"notification-" + index} eventKey="1">Instansi <b>{(users.find(y => y.id == x.instansi)?.name ?? "")}</b> memberikan tanggapan ke <b>{rpojk.find(y => y.id == x.rpojkId)?.judul ?? ""}</b></Dropdown.Item>
                    : <Dropdown.Item key={"notification-" + index} eventKey="1">Status tanggapan <b>{rpojk.find(y => y.id == x.rpojkId)?.judul ?? ""}</b> telah diubah oleh Admin</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='my-auto ps-4 d-flex' style={{ borderLeft: '1px solid #9FA3A9', height: 40, fontSize: 20 }}>
            <Dropdown className='d-flex'>
              <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                <span className=''><b>Hallo</b>, {users.find(x => x.id == loginId)?.name ?? ""}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {
                  localStorage.removeItem("loginId");
                  navigate("/login");
                }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div >
      <div className='p-4'>
        <Outlet context={{ Swal: CustomSwal, navigate, db }} />
      </div>
    </>
  );
}

export default App;
