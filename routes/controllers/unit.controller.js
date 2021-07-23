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
router.put('/', editUnit);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      UnitResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 *              name:
 *                  type: string
 *                  example: BOX
 *              code:
 *                  type: string
 *                  example: 001
 *              createdDate: 
 *                  type: string
 *                  example: 2021-06-25T13:51:47.165Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-25T13:51:47.181Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 */

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
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UnitResponse'
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
 *                content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/UnitResponse'   
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UnitResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    unitService.getById(req.params.id)
        .then(unit => unit ? res.json(unit) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /unit:
 *  put:
 *      description: Edit measurement units
 *      summary: Edit units
 *      tags:
 *          - Units
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *           required: true
 *           content:
 *                application/json:
 *                     schema:
 *                        type: object
 *                        properties: 
 *                            _id:
 *                                  type: string
 *                            name:  
 *                                  type: string
 *                            code:
 *                                  type: string 
 *                        required:
 *                             - _id
 *                             - name
 *                             - code
 *                        example:
 *                            _id: 60e7dfe6e30a202660186bc9
 *                            name: test_name
 *                            code: test_code
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UnitResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function editUnit(req, res, next){
    unitService.edit(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));

}