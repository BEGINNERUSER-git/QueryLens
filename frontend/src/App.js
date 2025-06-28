import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from './components/navbar.js'
import Home from './components/Home.js'
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import History from './components/History.js';
import ExplainState from './context/ExplainState';
import Explain from './components/Explain';
import TreeView from './components/TreeView.js';
import Start from './components/Start.js';
import Alert from './components/Alert.js';

function App() {
  return (
     <ExplainState>
    
    <Router>
      <Navbar/>
     
      <Routes>
        <Route path="/" element={<Start/>} />
        <Route path="/home" element={<Home  />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/explain' element={<Explain/>}/>
        <Route path='/treeview' element={<TreeView/>}/>

        


   
      </Routes>
      
    </Router>
        </ExplainState>

    
  );
}

export default App;
