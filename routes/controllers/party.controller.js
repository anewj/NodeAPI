const express = require('express');
const router = express.Router();
const partyService = require('services/party.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertParty);
router.get('/', getAllParty);
router.get('/:id', getById);

module.exports = router;
/**
 * @swagger
 * components:
 *  schemas:
 *      PartyResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60ed75cc252d46311ce4a15b
 *              title:
 *                  type: string
 *                  example: customer3
 *              name:
 *                  type: string
 *                  example: Hari
 *              contactNumber:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id: 
 *                              type: string
 *                              example: 60ed75cc252d46311ce4a15c
 *                          number:
 *                              type: number
 *                              example: 234123414
 *              emailAddress:
 *                  type: string
 *                  example: hari@gmail.com
 *              address:
 *                  type: string
 *                  example: test address   
 *              PAN:
 *                  type: number
 *                  example: 213234234
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-13T11:15:24.515Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-13T11:15:24.515Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60ed75cc252d46311ce4a15b
 */

/**
 * @swagger
 * /party:
 *  get:
 *      description: Find all parties
 *      summary: Get all party
 *      tags:
 *          - Party
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/PartyResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllParty(req, res, next) {
    partyService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /party:
 *  post:
 *      description: Create a party
 *      summary: Create party
 *      tags:
 *          - Party
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title: 
 *                              type: string
 *                          name:
 *                              type: string
 *                          contactNumber:
 *                              type: array
 *                              items: 
 *                                  type: object
 *                                  properties:
 *                                      number:
 *                                          type: number
 *                          emailAddress:
 *                              type: string
 *                          address:
 *                              type: string
 *                          PAN:
 *                              type: string
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PartyResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertParty(req, res, error) {
    partyService.create(req.body)
        .then(data => res.json(data))
        .catch(err => {
            const json = {
                status: 400,
                message: err
            }
            error(json);
        });
}

/**
 * @swagger
 * /party/{id}:
 *  get:
 *      description: Find party by party id
 *      summary: Get party by id
 *      tags:
 *          - Party 
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: party id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PartyResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    partyService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
