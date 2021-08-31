// BUILD YOUR SERVER HERE
const express = require('express')
const Users = require('./users/model.js')
const server = express()
server.use(express.json())

server.post('/api/users', (req, res) => {
    const newUser = req.body
    Users.insert(newUser)
      .then(user => {
        if (!user.name || !user.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"})
        } else {
        res.status(201).json(user)
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "There was an error while saving the user to the database" })
      })
})

server.get('/api/users', (req, res) => {
    Users.find()
      .then(allUsers => {
        res.status(200).json(allUsers)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "The users information could not be retrieved" })
      })
})

server.get('/api/users/:id', (req, res) => {
  Users.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

server.delete('/api/users/:id', (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "The user could not be removed" })
    })
})

// server.put('/api/users/:id', async (req, res) => {
//     const { id } = req.params
//     const updates = req.body
//     try {
//       const updatedUser = await Users.update(id, updates)
//       res.status(200).json(updatedUser)
//     } catch (err) {
//       console.log(err)
//       res.status(500).json({ message: err.message })
//     }
//  })

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const updates = req.body
    Users.update(id, updates)
        .then(updatedUser => {
            if (updatedUser && updates.name && updates.bio) {
                res.status(200).json(updatedUser)
            } else if (!updates.name || !updates.bio) {
                res.status(400).json({ message: "Please provide name and bio for the user" })
            } else { res.status(404).json({ message: "The user with the specified ID does not exist" })} 
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The user information could not be modified" })
        })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}


// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                   |
// | GET    | /api/users     | Returns an array users.                                                                                |
// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |