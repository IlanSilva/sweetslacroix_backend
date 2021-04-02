const express = require('express')
const app = express()


// TOOLS

app.use(express.json())




// OTHERS

const PORT = 8082

app.listen(PORT, () => {
    console.log(`Server executing on port ${PORT}`)
})
