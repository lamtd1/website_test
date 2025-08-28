import React,{useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import {Link} from 'react-router'
import {useForm} from 'react-hook-form'
import { useAuth } from '../auth'
import {useNavigate} from 'react-router-dom'

const LoginPage = () => {

    const {register, watch, reset, handleSubmit, formState:{errors}} = useForm();
    console.log(watch('username'))
    const navigate = useNavigate();
    const { login } = useAuth()
    const loginUser = async (data) => {
        try {
            await login(data.username, data.password)
            navigate("/")
        } catch (e) {
            console.error(e)
        } finally {
            reset()
        }
    }

    return (
        <div className='container'>
            <div className='form'>
                <h1>Sign up page</h1>
                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text'
                        placeholder='Your username'
                        {...register("username",{required:true, maxLength:25})}/>
                    </Form.Group>
                    {errors.username && <p style={{color: "red"}}> <small>Username is required</small></p>}
                  
                    <br/>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password'
                        placeholder='Your password'
                        {...register("password",{required:true, maxLength:80})}/>
                    </Form.Group>
                    <br/>
                    {errors.password && <p style={{color: "red"}}><small>Password is required</small></ p>}
               
                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(loginUser)}>Login</Button>
                    </Form.Group>
                    <Form.Group>
                        <small>Do not have an account? <Link to='/signup'>Sign up</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}


export default LoginPage 