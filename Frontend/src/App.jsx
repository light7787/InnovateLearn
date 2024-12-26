
import { Routes, Route } from 'react-router-dom';

import './App.css'
import Home from './Components/Home';
import Chome from './Subjects/C++/Chome';
import Jdoodle from './Components/jdoodle';
import Javascript from './Subjects/JavaScript/Javascript';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Qhome from './Subjects/C++/Quiz/Qhome';
import Userinfo from './Components/Userinfo';

import DsaSheet from './Components/DsaSheet';
import Abstraction from './Subjects/C++/Abstraction';
import ArrayPage from './Subjects/C++/ArrayPage';
import ClassesPage from './Subjects/C++/ClassesPage';
import CommentsPage from './Subjects/C++/CommentsPage';
import ConditionalsPage from './Subjects/C++/ConditionalsPage';
import ConstructorPage from './Subjects/C++/ConstructorPage';
import Deque from './Subjects/C++/Deque';
import Encapsulation from './Subjects/C++/Encapsulation';
import Enum from './Subjects/C++/Enum';
import Errors from './Subjects/C++/Errors';
import Exceptions from './Subjects/C++/Exceptions';
import Files from './Subjects/C++/Files';
import Datatypes from './Subjects/C++/Datatypes';





function App() {
 


  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cplusplus" element={<Chome />} />
    <Route path="/cplusplus/compiler" element={<Jdoodle />} />
    <Route path="/js" element={<Javascript />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cplusplus/quiz" element={<Qhome />} />
    <Route path="/userinfo" element={<Userinfo />} />  
    <Route path="/dsasheet" element={<DsaSheet />} />  
    <Route path="/cplusplus/abstraction" element={<Abstraction />} />  
    <Route path="/cplusplus/array" element={<ArrayPage/>} />  
    <Route path="/cplusplus/classes" element={<ClassesPage />} />  
    <Route path="/cplusplus/comment" element={<CommentsPage />} />  
    <Route path="/cplusplus/conditionals" element={<ConditionalsPage />} />  
    <Route path="/cplusplus/constructor" element={<ConstructorPage />} />  
    <Route path="/cplusplus/deque" element={<Deque />} />
        <Route path="/cplusplus/encapsulation" element={<Encapsulation />} />
        <Route path="/cplusplus/enum" element={<Enum />} />
        <Route path="/cplusplus/errors" element={<Errors/>} />
        <Route path="/cplusplus/exceptions" element={<Exceptions />} />
        <Route path="/cplusplus/files" element={<Files/>} />  
        <Route path="/cplusplus/data-types" element={<Datatypes/>} />  
 
    
    
  </Routes>
  )
}

export default App
