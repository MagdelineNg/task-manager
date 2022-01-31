require('../src/db/mongoose')
const Task = require("../src/models/task");

// Task.findByIdAndDelete('61f7693f6856e8f3c4e59224').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((incomplete) => {
//     console.log(incomplete)
// }).catch((e) => {
//     console.log(e)
// })

const findByIdAndDelete = async(id) => {
    const deleted = await Task.findByIdAndDelete(id)
    const incomplete = await Task.countDocuments({completed: false})
    return incomplete
}

findByIdAndDelete('61f76958ee8b126876ba09c0').then((incomplete) => {
    console.log(incomplete + "documents not completed")
}).catch((e) => {
    console.log("error: " + e)
})