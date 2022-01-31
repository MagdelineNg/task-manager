//let mongoose connect to database
require('../src/db/mongoose')

const User = require('../src/models/user')

// User.findByIdAndUpdate('61f35f25c1599cb1c476605', {age:1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeandCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id,{age} )
    const count = await User.countDocuments({age})
    return count
}

updateAgeandCount('61f619564d9d787ba8017862', 1).then((count) =>{
    console.log(count)
}).catch((e) => {
    console.log(e)
})