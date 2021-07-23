const db = require('../_helpers/db');
const Unit = db.Unit;
const stringUtils = require('../_helpers/stringUtils');

module.exports = {
    create,
    getAll,
    getById,
    edit
};
async function create(unitParam) {
    // save product
    unitParam.name = unitParam.name.toUpperCase();
    unitParam.code = unitParam.code.toUpperCase();
    const unit = new Unit(unitParam);
    await unit.save();
    return unit;
}

async function getAll() {
    return await Unit.find();
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Unit.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}

async function edit(unitParam){
    const unit = new Unit(stringUtils.objectValueToUpper(unitParam, 'name', 'code'));
    return await Unit.findOneAndUpdate({_id: unitParam._id}, unit, {new: true});
}
