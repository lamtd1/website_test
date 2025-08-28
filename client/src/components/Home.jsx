import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Recipe from './Recipe'
import {Modal} from 'react-bootstrap'
import {Form, Button} from 'react-bootstrap'
import {useForm} from 'react-hook-form'

const LoggedinHome = () => {
    const [recipes, setRecipes] = useState([])
    const [show, setShow] = useState(false)
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm()
    const [recipeId, setRecipeID] = useState(0)

        useEffect(() => {
                fetch(`${process.env.REACT_APP_API_URL}/recipe/recipes`)
                    .then(res => res.json())
                    .then(data => setRecipes(data))
                    .catch(err => console.log(err))
        }, [])

    const getAllRecipes = () => {
        fetch(`${process.env.REACT_APP_API_URL}/recipe/recipes`)
        .then(res => res.json())
        .then(data => {
            setRecipes(data)
        })
        .catch(err => console.log(err))
    }


    const closeModal = () => {
        setShow(false)
    }
    const showModal = (id) => {
        setShow(true)
        setRecipeID(id)

        recipes.map(
            (recipe) => {
                if(recipe.id === id){
                    setValue('title', recipe.title)
                    setValue('description', recipe.description)
                }
            }
        )
    }

    const { authFetch } = useAuth()

    const updateRecipe = (data) => {
        console.log(data)

        const requestsOptions = {
            method: 'PUT',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(data)
        }

        authFetch(`${process.env.REACT_APP_API_URL}/recipe/recipe/${recipeId}`, requestsOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // window.location.reload()
            getAllRecipes()
        })
        .catch(err => console.log(err))
        
        

        setShow(false);
    }

    const deleteRecipe = (id) => {
        console.log(id) 
        const requestsOptions = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        }
        authFetch(`${process.env.REACT_APP_API_URL}/recipe/recipe/${id}`, requestsOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            getAllRecipes()
            // window.location.reload()
        })
        .catch(err => console.log(err))
    }


    return (
        <div className='recipes container'>
            <Modal
                show = {show}
                size = 'lg'
                onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Recipe
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            <Button variant="primary" onClick={handleSubmit(updateRecipe)}>Save</Button>
                        </Form.Group>
                    </form>


                </Modal.Body>
            </Modal>
            <h1>List of recipes</h1>
            {
                recipes.map(
                    (recipe, index) => (
                        <Recipe 
                        key={index}
                        title={recipe.title} 
                        description={recipe.description}
                        onClick={() => showModal(recipe.id)}
                        onDelete={() =>{deleteRecipe(recipe.id)}}/>
                    )
                )
            }
        </div>
    )
}
const LoggedOutHome = () => {
    return (
        <div className='Home container'>
            <h1 className='heading'> Welcome to recipes </h1>
            <Link to='/signup' className='btn btn-primary btn-lg'>Get Started</Link>
        </div>
    )
}
const HomePage = () => {
    const { isLoggedIn } = useAuth()


    return (
        <div>
            {isLoggedIn ? <LoggedinHome/> : <LoggedOutHome/>}
        </div>

    )
}

export default HomePage