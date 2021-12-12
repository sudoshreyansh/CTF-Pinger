const model = require('../models/guild');
let guild;

(async () => {
    let document = (await model.find({}))[0];
    if ( document ) {
        guild = document;
    } else {
        guild = new model();
    }
})();

async function setClubRole(id) {
    guild.clubRole = id;
    await guild.save();
}

async function setNewsChannel(id) {
    guild.newsChannel = id;
    await guild.save();
}

async function setCategoryChannel(id) {
    guild.categoryChannel = id;
    await guild.save();
}

function getClubRole() {
    return guild.clubRole;
}

function getNewsChannel() {
    return guild.newsChannel;
}

function getCategoryChannel() {
    return guild.categoryChannel;
}

async function addCtf(id) {
    guild.ctfs.push(id);
    await guild.save();
}

function getUnregisteredCtfs(ctfs) {
    return ctfs.filter(ctf => !guild.ctfs.includes(ctf.id));
}

module.exports = {
    getClubRole,
    setClubRole,
    getNewsChannel,
    setNewsChannel,
    setCategoryChannel,
    getCategoryChannel,
    addCtf,
    getUnregisteredCtfs
}