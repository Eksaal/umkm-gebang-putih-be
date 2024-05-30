import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'umkm_data'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('category').notNullable()
      table.string('product_type').notNullable()
      table.string('business_type').notNullable()
      table.string('business_address').notNullable()
      table.string('business_contact').notNullable()
      table.string('contact_name').notNullable()
      table.string('opening_days').notNullable()
      table.string('special_closing_days').nullable()
      table.string('opening_hours').notNullable()
      table.string('services').notNullable()
      table.string('payment_methods').notNullable()
      table.string('facilities').notNullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.decimal('longitude', 10, 7).notNullable()
      table.string('food_price').notNullable()
      table.string('drink_price').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}