from flask_restx import Namespace, Resource, fields
from flask import request
from models import Recipe
from flask_jwt_extended import jwt_required
from exts import db



from flask import abort

def get_or_404(model, id):
    obj = db.session.get(model, id)
    if obj is None:
        abort(404, description=f"{model.__name__} with id {id} not found")
    return obj


recipe_ns = Namespace("recipe", description="A namespace for recipe")

recipe_model = recipe_ns.model(
    "Recipe",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
    }
)



@recipe_ns.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message":"Hello world"}


@recipe_ns.route('/recipes')
class RecipesResouce(Resource):
    @recipe_ns.marshal_list_with(recipe_model)
    def get(self):
        """Get all recipes"""
        recipes = db.session.query(Recipe).all()
        return recipes
    
    @recipe_ns.marshal_with(recipe_model)
    @recipe_ns.expect(recipe_model)
    @jwt_required()
    def post(self):
        """Create a new recipe"""
        data=request.get_json()
        new_recipe = Recipe(
            title=data.get('title'),
            description = data.get('description')
        )
        new_recipe.save()

        return new_recipe, 201

@recipe_ns.route('/recipe/<int:id>')
class RecipeResource(Resource):
    @recipe_ns.marshal_with(recipe_model)
    def get(self, id):
        """Get a recipe by id"""
        recipe = get_or_404(Recipe, id)
        return recipe
    
    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def put(self, id):
        """Update a recipe by id"""
        recipe_to_update = get_or_404(Recipe, id)

        data = request.get_json()

        recipe_to_update.update(data.get('title'), data.get('description'))

        return recipe_to_update
    
    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def delete(self, id):
        """Delete a recipe"""
        recipe_to_delete = get_or_404(Recipe, id)

        recipe_to_delete.delete()

        return recipe_to_delete
