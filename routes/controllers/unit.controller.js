const express = require('express');
const router = express.Router();
const unitService = require('services/unit.service');
const authorize = require('_helpers/authorize');
const Role = require('_helpers/role');

var fs = require('fs');

// routes
router.post('/',authorize([Role.Admin, Role.SuperAdmin]) , insertUnit);
router.get('/', getAllUnits);
router.get('/:id', getById);

module.exports = router;

/**
 * @swagger
 * /unit:
 *  get:
 *      description: displays all units
 *      summary: All units
 *      tags:
 *        - Units
 *      produces:
 *        - application.json    
 *      security: []
 *      responses:
 *          200:
 *              description: OK 
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message  
 */

function getAllUnits(req, res, next) {
    unitService.getAll()
        .then(unit => res.json(unit))
        .catch(err => next(err));
}
/**
 * @swagger
 * /unit:
 *  post:
 *       description: Create a new Unit 
 *       summary: Create Unit
 *       tags:
 *         - Units   
 *       produces:
 *         - application/json   
 *       security:
 *         - jwt: []
 *       requestBody:
 *           required: true
 *           content:
 *                application/json:
 *                     schema:
 *                        type: object
 *                        properties: 
 *                            name:  
 *                                  type: string
 *                            code:
 *                                  type: string 
 *                        required:
 *                             - name
 *                             - code
 *                        example:
 *                            name: test_name
 *                            code: test_code
 *       responses:
 *            200:
 *                description: OK 
 *            403:
 *                description: Access token does not have the required permission
 *            500:
 *                description: Internal Server Error or Custom Error Message   
 */
function insertUnit(req, res, next) {
    unitService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /unit/{id}:
 *  get:
 *      description: Find units by id
 *      summary: Units by id
 *      tags:
 *        - Units
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Unit id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 *      
 */
function getById(req, res, next) {
    unitService.getById(req.params.id)
        .then(unit => unit ? res.json(unit) : res.sendStatus(404))
        .catch(err => next(err));
}
