import Login from "./Components/Login"
import SignUp from "./Components/SignUp"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee';
import PrivateRoute from './Components/PrivateRoute';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}></Route>
        <Route path="/register" element={<PrivateRoute><SignUp /></PrivateRoute>}></Route> 
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/employee" element={<Employee />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App