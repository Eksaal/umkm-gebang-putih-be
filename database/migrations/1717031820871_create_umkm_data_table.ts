import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'umkm_data'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('category').notNullable()
      table.string('business_address').notNullable()
      table.string('business_contact').notNullable()
      table.string('contact_name').notNullable()
      table.text('opening_hours').notNullable()
      table.text('services').notNullable()
      table.text('payment_methods').notNullable()
      table.text('facilities').notNullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.decimal('longitude', 10, 7).notNullable()
      table.string('min_price').notNullable()
      table.string('max_price').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}