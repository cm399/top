# Calorie-Assen

## follow the following steps to run the app
$ mkdir data

$ cd ..

$ mongod --dbpath=data --bind_ip 127.0.0.1

$ use calorie

### on another terminal
$ cd calorie-server

$ npm start

## the following endpoints are available

### api/foods - GET
  returns all food items in the database.
  
### api/foods - POST
  takes userId, food name and calorie and creates a food item in the db

### api/foods - DELETE 
  deletes all food items in the db
  
### api/foodsbyuser/:userId - GET
  returns all food of the specific user

### api/foodsbyusers/:userId - DELETE
  deletes all food items of the specific user in the db
  
### users/login - POST
  takes username: string and password: string and returns token if login is successful or an error message otherwise.

### users/signup - POST
  takes name: string, username: string, password: string, admin: boolean
  returns success message if signup is successful, error message otherwise
