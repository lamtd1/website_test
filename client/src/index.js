import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Navbar';
import SignUpPage from './components/SignUp.jsx';
import LoginPage from './components/Login.jsx';
import HomePage from './components/Home.jsx';
import CreateRecipePage from './components/CreateRecipe.jsx';
import { AuthProvider } from './auth'
import {
        BrowserRouter as Router,
        Routes,
        Route,
} from  'react-router-dom'
import './styles/main.css'
const App= () => {
    
 
    return (
                <Router>
                    <AuthProvider>
                        <div className='container'>
                                <NavBar/>
                                <Routes>
                                        <Route path="/create-recipe" element={<CreateRecipePage />} />
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/signup" element={<SignUpPage />} />
                                        <Route path="/" element={<HomePage />} />
                                </Routes>
                        </div>
                    </AuthProvider>
                </Router>

    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)