const myRepository = require("../DB/repositories/ResturantRepository");

const getAllResturant = async (req, res) => {
    let results = await myRepository.getAllResturant();
    res.json(results);
}
module.exports.getAllResturant = getAllResturant;

//-------------------------------------
const getResturantById = async (req, res) => {
    let results = await myRepository.getResturantByID(req.params.id);
    res.json(results);
};
module.exports.getResturantById = getResturantById;

//-------------------------------------
const addNewResturant = async (req, res) => {
    let body = req.body;
    let results = await myRepository.addNewResturant(body);
    res.json(results);
};
module.exports.addNewResturant = addNewResturant;

//-------------------------------------
const updateResturant = async (req, res) => {
    let theId = req.params.id;
    let body = req.body;
    let results = await myRepository.updateResturantByID(theId, body);
    res.json(results);
};
module.exports.updateResturant = updateResturant;

//-------------------------------------
const deleteResturantById = async (req, res) => {
    let theId = req.params.id;
    let results = await myRepository.deleteResturantByID(theId);
    res.json(results)
};
module.exports.deleteResturantById = deleteResturantById;
//-------------------------------------
