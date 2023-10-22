const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.

// db config
// <user>:<pw>@<ip>
const user_pw_prefix = ""
const ip_port = "localhost:27017"
const db_name = "Hackathon"
const collection_name = "info"
const CONNECTION_STRING = `mongodb://${user_pw_prefix}${ip_port}/${db_name}`
const uri = CONNECTION_STRING

const get_db = async() => {
    const client = new MongoClient(uri);
    return client.db(db_name);
}
const get_col = async() => {
    const db = await get_db();
    return db.collection(collection_name);
}

const insert = async (info) => {
    const db = await get_col()
    return await db.insertOne(info);
}

/**
 * 
 * @param {Object} query {key: value}
 * @returns 
 */
const get = async(query) => {
    return get_col().findOne(query);
}

const showAll = async() => {
    for(i of get_col().find()){
        console.log(i)
    }
}


// async function run() {
//   try {
//     const database = client.db('sample_mflix');
//     const infos = database.collection(collection_name);
//     console.debug(infos)
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await infos.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

module.exports = {
    insert,
    get,
    showAll
}

if(require.main === module){
}