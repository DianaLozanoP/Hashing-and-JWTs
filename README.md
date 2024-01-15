## **Step 0: Setup**

- Install requirements, and make Git repo.
- Create ***messagely*** database and import schema from ***data.sql***

## **Step 1: Take a Tour**

Many parts of this exercise are already given to you, and shouldn’t need to change:

- ***app.js***
    - Pulls in user routes, messages routes, and auth routes
- ***expressError.js***
    - Handle errors in express more gracefully
- ***db.js***
    - Sets up  database
        
        ***messagely***
        
- ***server.js***
    - Starts server on 3000
- ***config.js***
    
    This may be a new file for us. As you build the app (and, in particular, the further study), you may add to it.
    
    Its job is to be a centralized place for constants needed in different places in the application. Other places should ***require()*** in these values.
    
    In order to make it easier to keep secret things secret, it also will try to read a file named ***.env***. This is a traditional name for a file containing “environmental variables needed for an application”.
    
    If you create a file like this:
    
    *.env*
    
    `SECRET_KEY = abc123`
    
    This ***config.js*** file will read and use it.
    
- ***middleware/auth.js***
    
    Useful middleware for “is a user logged in?” and “is the logged-in user the same as the ***:username*** provided in a route?”
    
    **Look carefully at this code** — it may be slightly different than other versions you’ve seen. Make sure you understand what it is doing!
    

## **Step 2: Fix the user model**

We’ve provided a module file for the ***User*** class:
Fill in the method bodies.

Make sure you read the docstrings carefully so your functions return the right output. Also, any method that tries to act on a particular user (like the ***.get()*** method) should throw an error if the user cannot be found.

If you get stuck, note that the ***Message*** class has been completed for you. You can look to the methods there for some inspiration or assistance with some of the more complex queries.

Once you have finished, you can run the tests we’ve provided for the ***User*** and ***Message*** models (make sure to create and seed the ***messagely_test*** database first!):
## **Step 3: Fix the routes**

We’ve provided stub files and docstrings from the routes.
In order, implement these routes. Make sure to check security appropriately:

- anyone can login or register
- any logged-in user can see the list of users
- only that user can view their get-user-detail route, or their from-messages or to-messages routes.
- only the sender or recipient of a message can view the message-detail route
- only the recipient of a message can mark it as read
- any logged in user can send a message to any other user
