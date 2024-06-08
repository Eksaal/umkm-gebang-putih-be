import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'umkm_pictures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
      .integer('umkm_data_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('umkm_data')
      .onDelete('CASCADE')
      .notNullable()
      table.string('picture_path')
      table.string('menu_picture_path')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}