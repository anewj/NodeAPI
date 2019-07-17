const db = require('../_helpers/db');
const Carousel = db.Carousel;

module.exports = {
    create,
    getAll
};
async function create(carouselParam) {
    // save product
    const carousel = new Carousel(carouselParam);

    await carousel.save();
}

async function getAll() {
    return await Carousel.find();
}