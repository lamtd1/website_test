import { useAuth } from '../auth'
import React, {useState} from "react"; 
import {Form, Button} from 'react-bootstrap'
import {useForm} from 'react-hook-form'

const CreateRecipePage = () => { 
    
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const [show, setShow] = useState(false)
    const { authFetch } = useAuth()

    const createRecipe = (data) => {
        console.log(data.title)
        console.log(data.description)
        const requestsOptions = {
            method: 'POST',
            headers: {
        'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }

    authFetch(`${process.env.REACT_APP_API_URL}/recipe/recipes`, requestsOptions)
        .then(res => res.json())
        .then(data => {
            reset()
        })
        .catch(err => console.log(err))
    }
    
    return (
    <div className="container">
        <h1>Create A Recipe</h1>
        <form>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type='text'
                {...register('title', {required: true, maxLength:25})}/>
                
            </Form.Group>
            {errors.title && <p style={{color: "red"}}><small>Title is required</small></ p>}
            {errors.title?.type==='maxLength' && <p style={{color: "red"}}><small>Max length is 25</small></ p>}
                
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' rows={5}
                {...register('description', {required: true, maxLength:225})}/>
                
            </Form.Group>

            {errors.description && <p style={{color: "red"}}><small>Description is required</small></ p>}
            {errors.description?.type==='maxLength' && <p style={{color: "red"}}><small>Max length is 225</small></ p>}
                   
            <br/>
            <Form.Group>
                <Button variant="primary" onClick={handleSubmit(createRecipe)}>Save</Button>
            </Form.Group>
        </form>
    </div>
)

}

export default CreateRecipePage