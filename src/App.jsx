import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login";
import Createpassword from "./pages/Createpassword";
import Dashboard from "./pages/Dashboard";
import Adduser from "./pages/users/Adduser";
import Manageuser from "./pages/users/Manageuser";
import Updateuser from "./pages/users/Updateuser";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/createpassword/:id/:verify" element={<Createpassword />}></Route>
        
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/manageuser" element={<Manageuser />}></Route>
        <Route path="/adduser" element={<Adduser />}></Route>
        <Route path="/updateuser/:id/" element={<Updateuser />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
