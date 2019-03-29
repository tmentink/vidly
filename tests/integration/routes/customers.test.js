/* eslint-disable no-return-await */
const request = require('supertest')
const { Customer } = require('../../../models/customer')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')

const baseUrl = '/api/customers'
const customers = [
  { name: 'name1', phone: '999-999-9999', isGold: true },
  { name: 'name2', phone: '111-111-1111', isGold: false },
]
let server
let token
let name
let phone
let isGold

describe(baseUrl, () => {
  beforeEach(() => {
    server = require('../../../server')
    token = new User({ isAdmin: true }).generateAuthToken()
    name = customers[0].name
    phone = customers[0].phone
    isGold = customers[0].isGold
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
        const c = res.body.find(x => x.name === customer.name)

        expect(c).toHaveProperty('name', customer.name)
        expect(c).toHaveProperty('phone', customer.phone)
        expect(c).toHaveProperty('isGold', customer.isGold)
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
    const exec = async () => {
      return await request(server)
        .post(baseUrl)
        .set('x-auth-token', token)
        .send({ name, phone, isGold })
    }

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      name = ''

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
      phone = ''

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
    let customer
    let id

    const exec = async () => {
      return await request(server)
        .put(`${baseUrl}/${id}`)
        .set('x-auth-token', token)
        .send({ name, phone, isGold })
    }

    beforeEach(async () => {
      customer = new Customer(customers[0])
      await customer.save()

      id = customer._id
      name = 'updatedName'
      phone = '222-222-2222'
      isGold = false
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if name is missing', async () => {
      name = ''

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
      phone = ''

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

      expect(updatedcustomer.name).toBe(name)
    })

    it('should return the updated customer if it is valid', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', name)
      expect(res.body).toHaveProperty('phone', phone)
      expect(res.body).toHaveProperty('isGold', isGold)
    })
  })

  describe('DELETE /:id', () => {
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
