import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';  
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import NotFound from './components/ErrorPage/ErrorPage'; 
import LoginPage from './components/Header/Authorization/LoginPage';
import Footer from './components/Footer/Footer';
import DataSearchPage from './components/DataSearchPage/DataSearchPage';
import store from './stores/AuthStore';  
import ProtectedComponent from '../src/components/ProtectedComponent';
import ResultPage from './components/ResultPage/ResultPage';


const App = observer(() => { 
  useEffect(() => {
    if (store.checkAuth()) {
        console.log('Пользователь авторизован');
    } else {
        console.log('Пользователь не авторизован');
    }
}, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<NotFound />} />
          <Route path="/data-search" element={<ProtectedComponent element={<DataSearchPage />} />} />
          <Route 
            path="/protected" 
            element={store.isAuthenticated ? <ProtectedComponent /> : <Navigate to="/login" />} 
          />
          <Route path="/result-page" element={<ProtectedComponent element={<ResultPage />} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
});

export default App;