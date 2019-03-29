/* eslint-disable no-return-await */
const request = require('supertest')
const { Customer } = require('../../../models/customer')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')

const baseUrl = '/api/customers'
const customers = [
  { name: 'name1', phone: '999-999-9999', isGold: true },
  { name: 'name1', phone: '111-111-1111', isGold: false },
]
let server

describe(baseUrl, () => {
  beforeEach(() => {
    server = require('../../../server')
  })

  afterEach(async () => {
    await Customer.deleteMany({})
    await server.close()
  })

  describe('GET /', () => {
    it('should return all customers', async () => {
      await Customer.collection.insertMany(customers)

      const res = await request(server).get(baseUrl)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(customers.length)

      customers.forEach(customer => {
        expect(res.body.some(c => c.name === customer.name)).toBeTruthy()
        expect(res.body.some(c => c.phone === customer.phone)).toBeTruthy()
        expect(res.body.some(c => c.isGold === customer.isGold)).toBeTruthy()
      })
    })
  })

  describe('GET /:id', () => {
    it('should return a customer if valid id is passed', async () => {
      const customer = new Customer(customers[0])
      await customer.save()

      const res = await request(server).get(`${baseUrl}/${customer._id}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', customer.name)
      expect(res.body).toHaveProperty('phone', customer.phone)
      expect(res.body).toHaveProperty('isGold', customer.isGold)
    })

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get(`${baseUrl}/1`)

      expect(res.status).toBe(404)
    })

    it('should return 404 if no customer with the given id exists', async () => {
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get(`${baseUrl}/${id}`)

      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let name
    let phone
    let isGold

    const exec = async () => {
      return await request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ name, phone, isGold })
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = customers[0].name
      phone = customers[0].phone
      isGold = customers[0].isGold
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      name = undefined

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is less than 5 characters', async () => {
      name = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is more than 50 characters', async () => {
      name = new Array(52).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is missing', async () => {
      phone = undefined

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is less than 10 characters', async () => {
      phone = '1'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is more than 20 characters', async () => {
      phone = new Array(22).join('1')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save the customer if it is valid', async () => {
      await exec()

      const customer = await Customer.find({ name: customers[0].name })

      expect(customer).not.toBeNull()
    })

    it('should return the customer if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', customers[0].name)
      expect(res.body).toHaveProperty('phone', customers[0].phone)
      expect(res.body).toHaveProperty('isGold', customers[0].isGold)
    })
  })

  describe('PUT /:id', () => {
    let token
    let newName
    let newPhone
    let newIsGold
    let customer
    let id

    const exec = async () => {
      return await request(server)
        .put(`${baseUrl}/${id}`)
        .set('x-auth-token', token)
        .send({ name: newName, phone: newPhone, isGold: newIsGold })
    }

    beforeEach(async () => {
      customer = new Customer(customers[0])
      await customer.save()

      token = new User().generateAuthToken()
      id = customer._id
      newName = 'updatedName'
      newPhone = '222-222-2222'
      newIsGold = false
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      newName = undefined

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is less than 5 characters', async () => {
      newName = 'a'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if name is more than 50 characters', async () => {
      newName = new Array(52).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is missing', async () => {
      newPhone = undefined

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is less than 10 characters', async () => {
      newPhone = '1'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if phone is more than 20 characters', async () => {
      newPhone = new Array(22).join('1')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 404 if customer with the given id was not found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should update the customer if input is valid', async () => {
      await exec()

      const updatedcustomer = await Customer.findById(customer._id)

      expect(updatedcustomer.name).toBe(newName)
    })

    it('should return the updated customer if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', newName)
      expect(res.body).toHaveProperty('phone', newPhone)
      expect(res.body).toHaveProperty('isGold', newIsGold)
    })
  })

  describe('DELETE /:id', () => {
    let token
    let customer
    let id

    const exec = async () => {
      return await request(server)
        .delete(`/api/customers/${id}`)
        .set('x-auth-token', token)
        .send()
    }

    beforeEach(async () => {
      customer = new Customer(customers[0])
      await customer.save()

      id = customer._id
      token = new User({ isAdmin: true }).generateAuthToken()
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken()

      const res = await exec()

      expect(res.status).toBe(403)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 404 if no customer with the given id was found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should delete the customer if input is valid', async () => {
      await exec()

      const customerInDb = await Customer.findById(id)

      expect(customerInDb).toBeNull()
    })

    it('should return the removed customer', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', customer._id.toHexString())
      expect(res.body).toHaveProperty('name', customer.name)
      expect(res.body).toHaveProperty('phone', customer.phone)
      expect(res.body).toHaveProperty('isGold', customer.isGold)
    })
  })
})
