# data

## User

- username: required, unique, string min 3 max 30 chars
- password: required, unique, string min 8 max 30 chars
- email: required, unique, string, valid email format
- myRecipes - array ObjectId-Recipe
- favoriteRecipes: array ObjectId-Recipe
- scheduledRecipes: array { recipeId: ObjectId-Recipe | ScheduledDate: number }
- createdAt: number - default: timestamp

## Recipe

- name: required, string
- urlSlug: required, unique (/timestamp/dahed-name)
- author: required, ObjectId-User
- type: required, enum: desayuno, almuerzo, comida, cena, postre
- ingredients: required, array { name: string - quantity: string }
- steps: required, array { step: strings, order: number }
- elaborationTime: required, string max 12 chars
- image: required, string from filename - Valid image file
- backup-image: required, string from filename - Valid image file
- createdAt: number, default: timestamp

# Endpoints

## users

- POST: /users/register
  - body-json: username, email, password, passwordConfirm
  - middleware: joi
- POST: /users/login
  - body-json: username, password
  - middleware: joi

## recipes

- GET: /recipes
- GET: /recipes/:urlSlug
  - middleware: joi
- GET: /recipes/:user
  - middleware: auth, joi
- GET: /recipes/favorites/:user
  - middleware: auth, joi
- GET: /recipes/scheduled/:user
  - middleware: auth, joi
- POST: /recipes/create
  - body-json: name, author, type, ingredients, steps, image
  - middleware: auth, joi
- PATCH: /recipes/update/:id
  - body-json: name, author, type, ingredients, steps, image
  - middleware: auth, joi
- DELETE: /recipes/delete/:id
  - middleware: auth, joi
