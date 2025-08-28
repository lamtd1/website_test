import React,{useState} from 'react'
import {Form, Button, Alert} from 'react-bootstrap'
import {Link} from 'react-router'
import {useForm} from 'react-hook-form'

const SignUpPage = () => {
    // const [username, setUsername] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')

    const {register, watch, handleSubmit, reset, formState:{errors}} = useForm();

    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('')
    const submitForm = (data) => {
        if (data.password === data.confirmPassword){
            
            const body = {
                username: data.username,
                email: data.email,
                password: data.password
            }

            const requestsOptions = {
                method: "POST",
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(body)
            }

                fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, requestsOptions)
                .then(res => res.json())
                .then(data => {
                    setServerResponse(data.message)
                    console.log(serverResponse)
                    setShow(true)
                })
                .catch(err => console.log(err))

            reset()
        }else{
            alert("Password not matched ")
        }
            
        
    }


    return (
        <div className='container'>
            <div className='form'>
                {show ? 
                <>
                 <Alert show={show} variant="success">
                    <p>
                        {serverResponse}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-success">
                        Close me
                    </Button>
                    </div>
                </Alert>
                <h1>Sign up page</h1>
                </>:<h1>Sign up page</h1>

                }

                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text'
                        placeholder='Your username'
                        {...register("username",{required:true, maxLength:80})}/>
                    </Form.Group>
                    <br/>
                    {errors.username && <p style={{color: "red"}}> <small>Username is required</small></p>}
                  
                    {errors.username?.type==='maxLength' && <p style={{color: "red"}}><small>Max length is 25</small></ p>}
                
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email'
                        placeholder='Your email'
                        {...register("email",{required:true, maxLength:80})}/>
                    </Form.Group>
                    <br/>
                    {errors.email && <p style={{color: "red"}}><small>Email is required</small></ p>}
                        {errors.email?.type==='maxLength' && <p style={{color: "red"}}><small>Max length is 80</small></ p>}
           
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password'
                        placeholder='Your password'
                        {...register("password",{required:true, minLength:8})}/>
                    </Form.Group>
                    <br/>
                    {errors.password && <p style={{color: "red"}}><small>Password is required</small></ p>}
               
                        {errors.password?.type==='minLength' && <p style={{color: "red"}}><small>Min length is 8</small></ p>}
             
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password'
                        placeholder='Your password'
                        {...register("confirmPassword",{required:true, minLength:8})}/>
                    </Form.Group>
                    <br/>
                    {errors.confirmPassword && <p style={{color: "red"}}><small>Confirm password is required</small></ p>}
               
                        {errors.confirmpPassword?.type==='minLength' && <p style={{color: "red"}}><small>Min length is 8</small></ p>}
              
                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(submitForm)}>Signup</Button>
                    </Form.Group>
                 
                    <Form.Group>
                        <small>Already have account? <Link to='/login'>Login</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage