
import { Routes, Route } from 'react-router-dom';

import './App.css'
import Home from './Components/Home';
import Chome from './Subjects/C++/Chome';
import Jdoodle from './Components/Jdoodle';
import Javascript from './Subjects/JavaScript/Javascript';
import JsQhome from './Subjects/JavaScript/Quiz/Qhome';
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
import Phome from './Subjects/Python/Phome';
import PCompiler from './Subjects/Python/Compiler';
import PIntroduction from './Subjects/Python/Introduction';
import PDatatypes from './Subjects/Python/Datatypes';
import PFunctions from './Subjects/Python/Functions';
import PFiles from './Subjects/Python/Files';
import PConditionals from './Subjects/Python/Conditionals';
import PyQhome from './Subjects/Python/Quiz/Qhome';
import PLoops from './Subjects/Python/Loops';
import PModules from './Subjects/Python/Modules';
import POOP from './Subjects/Python/OOP';
import PExceptions from './Subjects/Python/Exceptions';
import PListComprehensions from './Subjects/Python/ListComprehensions';
import PGenerators from './Subjects/Python/Generators';
import PDecorators from './Subjects/Python/Decorators';
import PIterators from './Subjects/Python/Iterators';
import PVenv from './Subjects/Python/Venv';
import PStdlib from './Subjects/Python/Stdlib';
import PRegex from './Subjects/Python/Regex';
import PNetworking from './Subjects/Python/Networking';
import PythonLayout from './Subjects/Python/PythonLayout';





function App() {
 


  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cplusplus" element={<Chome />} />
    <Route path="/cplusplus/compiler" element={<Jdoodle />} />
    <Route path="/js" element={<Javascript />} />
  <Route path="/js/quiz" element={<JsQhome />} />
  <Route path="/python" element={<PythonLayout />}>
    <Route index element={<Phome />} />
    <Route path="compiler" element={<PCompiler />} />
    <Route path="introduction" element={<PIntroduction />} />
    <Route path="datatypes" element={<PDatatypes />} />
    <Route path="functions" element={<PFunctions />} />
    <Route path="files" element={<PFiles />} />
    <Route path="conditionals" element={<PConditionals />} />
    <Route path="quiz" element={<PyQhome />} />
    <Route path="loops" element={<PLoops />} />
    <Route path="modules" element={<PModules />} />
    <Route path="oop" element={<POOP />} />
    <Route path="exceptions" element={<PExceptions />} />
    <Route path="list-comprehensions" element={<PListComprehensions />} />
    <Route path="generators" element={<PGenerators />} />
    <Route path="decorators" element={<PDecorators />} />
    <Route path="iterators" element={<PIterators />} />
    <Route path="venv" element={<PVenv />} />
    <Route path="stdlib" element={<PStdlib />} />
    <Route path="regex" element={<PRegex />} />
    <Route path="networking" element={<PNetworking />} />
  </Route>
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
