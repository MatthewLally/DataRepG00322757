# **_Single Page Application Movies Database_**

**Student Name:** Matthew Lally </br>
**Student ID:** G00322757 </br>
**Module:** Data Representation and Querying </br>
**Lecturer:** Martin Kenirons </br>

## **_Introduction_**
This project is a  part of a Data Representation and Querying module based in GMIT (Galway-Mayo Institute of Technology). Based on the project brief I had to  You are required to develop a single-page web
application(SPA) written in the programming language Javascript using the Node.js / Express
framework. You must devise an idea for a web application, write the software, write documentation
explaining how the application works, and write a short user guide for it.

The website I have created contains information about different movies . The user can add new movies, new movie stars, new directors, and new genres. These will be saved in a mongodb database which is hosted on mLab. The user then has the option of deleting a movie, deleting a star or updating the stars details, delting a director or updating the directors details, deleting a genre or updating the genres details.

## **_What is a Single Page Application_**
Single-Page Applications (SPAs) are Web apps that load a single HTML page and dynamically update that page as the user interacts with the app. SPAs use AJAX and HTML5 to create fluid and responsive Web apps, without constant page reloads. However, this means much of the work happens on the client side, in JavaScript.

## **_Creating the website_**
Before creating the website , I had to sit down and think what information would be needed in the database. I would need information about the movies including its release date, genre, title, star, and director . For the genre I would just need a title of the genre. For the movie stars I would need there name, date of birth, date of death if applicable, and nationality. I would need the same information for the directors. 

## MongoDB

I decided to use mongodb as it is widely used and as taken from mongodb.com : Using MongoDB removes the complex object-relational mapping (ORM) layer that translates objects in code to relational tables. MongoDB's flexible data model also means that your database schema can evolve with business requirements.

## Express
Express 3.x is a light-weight web application framework to help organize your web application into an MVC architecture on the server side. You can use a variety of choices for your templating language (like EJS, Jade, Pug, and Dust.js).

## Node
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

## **_User Guide_**
A user guide for this application can be found here in the wiki section of this repository : https://github.com/MatthewLally/DataRepG00322757/wiki


## References

- https://neo4j.com/docs/developer-manual/current/cypher/

- My Lecturer Martin Kenirons PDF Notes
- https://learnonline.gmit.ie/ 
- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- All express documentation on this site - https://expressjs.com/en/starter/installing.html
- https://expressjs.com/en/guide/using-template-engines.html
-  All Mongoose documention on this site http://mongoosejs.com/docs/guide.html
- http://caolan.github.io/async/docs.html
- Pug Documentation : https://pugjs.org/api/getting-started.html
- http://momentjs.com/docs/
- https://www.npmjs.com/package/express-validator
- https://www.w3schools.com/bootstrap/






