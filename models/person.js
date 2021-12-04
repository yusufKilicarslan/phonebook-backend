
const mongoose = require('mongoose')
const unique = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => console.log(`connected to MongoDB ${url}`))
  .catch(() => console.log(`error, could not connect MongoDB ${url}`))

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, minLength: 3 },
  number: { type: String, unique: true, required: true }
})
personSchema.plugin(unique)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
