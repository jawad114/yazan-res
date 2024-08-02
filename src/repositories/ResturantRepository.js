const ResturantModels = require('./models/ResturantModels');
const ObjectId = require('mongodb').ObjectID;

const Resturant = ResturantModels.Resturant;

// Update info of a contact by its id
const updateResturantByID = async (ResturantID, ResturantInfo) => {
    const x = await Resturant.updateOne({ _id: ResturantID }, ResturantInfo);
    console.log(`updateResturantByID ${JSON.stringify(x)}`);
    return JSON.stringify(x);
};
exports.updateResturantByID = updateResturantByID;

//------------------------------------------
const updateResturantByMajor = async (Major, ResturantInfo) => {
    const resultFromDB = await Resturant.updateMany({ Major: Major }, ResturantInfo);
    console.log(resultFromDB);
    return JSON.stringify(resultFromDB);
}
exports.updateResturantByMajor = updateResturantByMajor;

//------------------------------------------
// Get all Resturant
const getAllResturant = async () => {
    const x = await Resturant.find();
    console.log(`getAllResturant ${JSON.stringify(x)}`);
    return JSON.parse(JSON.stringify(x));
};
exports.getAllResturant = getAllResturant;

//------------------------------------------
// Get info of a contact by its id
const getResturantByID = async (theID) => {
    const x = await Resturant.findOne({ _id: theID });
    console.log(`getResturantByID ${JSON.stringify(x)}`);
    return x;
};
exports.getResturantByID = getResturantByID;

//------------------------------------------
// Delete a Resturant by its id
const deleteResturantByID = async (theID) => {
    const x = await Resturant.deleteOne({ _id: theID });
    console.log(`deleteResturantByID ${JSON.stringify(x)}`);
    return (`deleted ${x.n} documents`);
};
exports.deleteResturantByID = deleteResturantByID;

//------------------------------------------
// Add a Resturant
const addNewResturant = async (ResturantInfo) => {
    console.log("--", JSON.stringify(ResturantInfo));
    const newResturant = new Resturant(ResturantInfo);
    try {
        const x = await newResturant.save();
        console.log(`addNewCResturant ${JSON.stringify(x)}`);
        return (`added new Resturant with id ${x._id}`);
    } catch (err) {
        console.log("ERR while trying to save new Resturant doc ", err);
    }
};
exports.addNewResturant = addNewResturant;

//------------------------------------------
//------------------------------------------
// Delete all Resturant
const deleteAllResturant = async () => {
    const x = await Resturant.deleteMany();
    console.log(`deleteAllResturant ${JSON.stringify(x)}`);
    return (`deleted ${x.n} documents`);
};
exports.deleteAllResturant = deleteAllResturant;

//------------------------------------------
// Delete Resturant by year
const deleteResturantyYear = async (theYear) => {
    const x = await Resturant.deleteMany({ year: theYear });
    console.log(`deleteResturantByYear ${JSON.stringify(x)}`);
    return (`deleted ${x.n} documents`);
};
exports.deleteResturantByYear = deleteResturantByYear;
