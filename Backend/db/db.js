const mongoose = require('mongoose');

const connectTOdb =()=>{
   mongoose.connect(process.env.MONGO_URI )
   .then(()=>{
        console.log('Connecting to DB');
   }).catch(err=>{console.log(err)});
   
}

module.exports = connectTOdb;