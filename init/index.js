const mongoose = require('mongoose');

const allList = require('./data.js'); //sempale data

const Listning = require('../model/listning'); //schema


main()
    .then(() => { console.log('DB connected') })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
    await savedata();

}

const savedata = async() => {
    await Listning.deleteMany({});
    allList.data=allList.data.map((obj)=>({...obj,owner:'69e8725732197f057c263b1a'}))
    await Listning.insertMany(allList.data)
}
