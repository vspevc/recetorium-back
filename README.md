# Recetorium back-end

This is a cooking recipes CRUD hands-on web development consisting of two code bases, a front-end made with React Redux Toolkit and the back-end is a REST API made with Express.  
Working example: [https://recetorium.vercel.app](https://recetorium.vercel.app)

You can access the front-end code at: [https://github.com/vspevc/recetorium-front](https://github.com/vspevc/recetorium-front)

---

## Table of content

<!-- TOC -->
* [Recetorium back-end](#recetorium-back-end)
  * [Table of content](#table-of-content)
  * [Technologies](#technologies)
  * [Setup](#setup)
  * [Endpoints](#endpoints)
    * [GET /](#get-)
      * [Request Parameters](#request-parameters)
      * [Response Body](#response-body)
      * [Response Codes](#response-codes)
      * [Example](#example)
    * [GET /recipes/search](#get-recipessearch)
      * [Request Query Parameters](#request-query-parameters)
      * [Request Body Parameters](#request-body-parameters)
      * [Response Body](#response-body-1)
      * [Response Codes](#response-codes-1)
      * [Example](#example-1)
    * [POST /recipes/create](#post-recipescreate)
    * [POST /users/register](#post-usersregister)
    * [Recipe object](#recipe-object)
<!-- TOC -->

---

## Technologies

Project build with:
- typescript: 4.8.4
- express: 4.18.2
- mongoose: 6.7.2
- multer: 1.4.5-lts.1
- Sharp: 0.31.2
- bcryptjs: 2.4.3
- supabase/supabase-js: 2.1.1

Testing with Jest and supertest:
- faker-js/faker: 7.6
- fishery: 2.2.2
- mongodb-memory-server: 8.10
---

## Setup

To run this project, install it locally at repository root directory:

```
$ npm install
```

You need to add some info at .env file:

```
PORT=4000
DEBUG=recetorium:*
MONGODB_URL=mongodb://127.0.0.1:27017/recetorium
CORS_ALLOWED_ORIGINS=https://your.front-website.origin,http://localhost:3000
SUPABASE_URL=https://your.supabase.co
SUPABASE_KEY=supabase#key
SUPABASE_RECIPE_IMAGES_BUCKET=recipe-images-bucket
```

Then you need to build before run the server:

```
$ npm run build
$ npm start
```

---

## Endpoints

* [GET /](#get-)
* [GET /recipes/search](#get-recipessearch)
* [POST /recipes/create](#post-recipescreate)
* [POST /users/register](#post-usersregister)

### GET /

Greets the client, it can be used as health check.

#### Request Parameters

none

#### Response Body

| Field   | Type   | Description       |
|---------|--------|-------------------|
| message | string | Greets the client |

#### Response Codes

|  Code   | Description                   |
|---------|-------------------------------|
| 200 OK  | Successfully connected to API |

#### Example

```
curl -X GET 'https://your.api.url'
```
```
{
  "message": "Welcome to Recetorium API"
}
```

### GET /recipes/search

Search for recipes that match the request.

#### Request Query Parameters

| Name     | Type   | Required? | Description                           |
|----------|--------|-----------|---------------------------------------|
| page     | number | No        | The page you want to load.            |
| per-page | number | No        | The amount of recipes shown per page. |

#### Request Body Parameters

| Field | Type     | Required? | Description                                                                                                                         |
|-------|----------|-----------|-------------------------------------------------------------------------------------------------------------------------------------|
| name  | string   | No        | A string to fuzzy search on recipes name.                                                                                           |
| types | object[] | No        | A list of types name to match for recipes types.<br/>Accepted types name values: "desayuno", "almuerzo", "comida", "cena", "postre" |

#### Response Body

| Field             | Type     | Description                                                                                  |
|-------------------|----------|----------------------------------------------------------------------------------------------|
| previousPage      | string   | The path for the previous page results, if there is no previous page returns null.           |
| nextPage          | string   | The path for the next page results, if there is no next page returns null.                   |
| totalPages        | number   | The number of pages.                                                                         |
| recipes           | object[] | A list of [recipe object](#recipe-object), if there is no matches it returns an empty array. |

#### Response Codes

| Code            | Description                                                                                    |
|-----------------|------------------------------------------------------------------------------------------------|
| 200 OK          | Successfully searched for recipes, even if did not find any result.                            |
| 400 Bad Request | - When wrong parameters type.<br/>- When request body parameter "types" have an invalid value. |

#### Example

```
curl -X GET 'https://your.api.url/recipes/search'
```
```
{
  "previousPage": null,
  "nextPage": "/recipes/search?page=2",
  "totalPages": 13,
  "recipes": [
    {
      "name": "'Smoothie' de choco, plátano y muesli",
      "urlSlug": "1670477412530/smoothie-de-choco-platano-y-muesli",
      "author": "63851ce5edfc297f0b0060c8",
      "types": [
        {
          "name": "desayuno", "id": "639176646f0eb03905f923c9"
        }
      ],
      "ingredients": [
        {
          "name": "Bebida vegetal almendras, soja, avena, etc.",
          "quantity": "1 litro",
          "id": "639176646f0eb03905f923ca"
        },
        { ... }
      ],
      "steps": [
        {
          "step": "Funde el chocolate troceado en un bol con un poco de bebida vegetal en el micro o en un cazo.",
          "order": 1,
          "id": "639176646f0eb03905f923d0"
        },
        { ... }
      ],
      "elaborationTime": "10 min",
      "image": "https://recetorium.up.railway.app/recipes/images/banana-choco-adobe-t-1670477411201.webp",
      "backupImage": "https://pzmzqeelxnciuqldqjds.supabase.co/storage/v1/object/public/recipes/banana-choco-adobe-t-1670477411201.webp",
      "createdAt": 1670475256922,
      "id": "639176646f0eb03905f923c8"
    },
    { ... },
  ]
}
```

### POST /recipes/create

### POST /users/register

### Recipe object

| Field           | Type     | Description                                                                        |
|-----------------|----------|------------------------------------------------------------------------------------|
| id              | string   | The recipe ID.                                                                     |
| name            | string   | The recipe name.                                                                   |
| urlSlug         | string   | The recipe slug.                                                                   |
| author          | string   | The author id.                                                                     |
| types           | object[] | A list with the recipe types.                                                      |
| ingredients     | object[] | A list with the recipe ingredients and it's quantity.                              |
| steps           | object[] | A list with the recipe steps and it's order.                                       |
| elaborationTime | string   | The recipe elaboration time.                                                       |
| image           | string   | The recipe image url.                                                              |
| backupImage     | string   | The recipe image backup url.                                                       |
| createdAt       | number   | The recipe creation time in timestamp format.                                      |
