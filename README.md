# Coffee Shop Locator 

CoffeeShopLocator is a REST API that allows the developer to send and receive details about Coffee Shop based on the Coffee Shop’s name, location and address. It provides functionalities to Create, Read, Update, Delete and find nearest coffee shop. 

## Features
  * Core functionalities are written in Node.js 
  * Unit testing are done by Mocha and Chai.
  
## API Operations
  CoffeeShopLocator performs has five Endpoints. 
  * Create - 
             `localhost:PORT/create`
        
  * Read all-
            `localhost:PORT/read`
            
  * Update - 
            `localhost:PORT/update/<id>` 
            
  * Delete - 
            `localhost:PORT/delete/<id>`
            
  * Find Nearest shop based on the given address - 
            `localhost:PORT/find-nearest`

## Installation Instructions
1.	Install node.js Instructions found here : http://nodejs.org

2.	Clone the repository from github using this command:

    `https://github.com/Florahelan/coffeeShopLocator.git`
    
3.  All dependencies are located in `package.json` to install them type the below command in terminal where the project       structure is located.   

    `npm install`
    
4.  After a successful install of the dependencies to the node_modules folder, the JavaScript files can to be executed.

## Run

1.  Run the JavaScript program from your IDE (Webstorm) /Terminal.
     `node server.js`
By default the host port is set to 4500 . To change the port type 
      `$ EXPORT PORT = <Your Port> && node server.js`

2.	For unit testing type the below command.

    `npm test`
    
## Testing Via PostMan 

1. The repository includes a [Postman](https://www.getpostman.com/) collection, to be [downloaded](https://github.com/Florahelan/coffeeShopLocator/blob/master/postman/Localhost.postman_collection) and add it to the PostMan application to test it out. 

### ScreenShots


## Testing Via Terminal 
1. Once the node server is running, Open another instance in the terminal and you can test the functionality using simple curl commands 

Example : 
   1. Read all Coffee Shops :  :   `curl localhost:PORT/read`

   2. Read Single Coffee Shop by Id  :   `curl localhost:PORT/read/<id>`

   3. Get Nearest to your location : `curl localhost:PORT/find-nearest?address=<Url-encoded-Address>`
