const { Customer } = require('./models/customer')
const mongoose = require('mongoose')
const config = require('config')

const data = [
  {
    name: 'Marta Benson',
    phone: '(804) 426-3085',
    isGold: true,
  },
  {
    name: 'Travis Guerrero',
    phone: '(947) 418-2949',
    isGold: false,
  },
  {
    name: 'Brady Hanson',
    phone: '(969) 544-2395',
    isGold: false,
  },
  {
    name: 'Katheryn Solis',
    phone: '(974) 489-3148',
    isGold: true,
  },
  {
    name: 'Eliza Mason',
    phone: '(808) 545-2622',
    isGold: false,
  },
]

async function seed() {
  await mongoose.connect(config.get('db'))

  await Customer.deleteMany({})
  for (let customer of data) {
    await new Customer({
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    }).save()
  }

  mongoose.disconnect()

  console.info('Done!')
}

seed()
