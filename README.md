# Secret Family Recipes
Secret Family Recipes is a full-stack CRUD application where users can log in and share their favorite family recipes. Once logged in, users can create, view, or delete their own recipes. The homepage displays a list of all submitted recipe titles. When a user clicks on the title, it takes them to a detailed view containing the full recipe instructions along with a comment section, where others can share thoughts, tips, or variations. This app offers a community-driven space to preserve and pass down cherished recipes while encouraging engagement through user interaction.

**Link to project:** https://family-recipes-g9hi.onrender.com

![alt tag](/public/img/Family-Recipes.png)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Node, EJS

I built Secret Family Recipes using JavaScript, Express, Node.js, and EJS to create a full-stack CRUD web application. The app allows users to sign up, log in, and securely manage their own recipe entries. Each recipe includes a title, instructions, and a comment section. I used EJS to dynamically render views, allowing users to interact with recipe content in real time. CRUD functionality is implemented across the app: users can create and read public recipes, as well as like or delete their own. Comments are also stored and retrieved from a MongoDB database, with routes and controllers handling the relationships between users, recipes, and comments. 

## Lessons Learned:

Through this project, I deepened my understanding of RESTful routing, authentication, and organizing a clean backend-to-frontend data flow.

## Installation

1. Clone repo
2. run `npm install`

## Usage

1. run `node server.js`
2. Navigate to `localhost:8080`

## Credit

Modified from Scotch.io's auth tutorial
