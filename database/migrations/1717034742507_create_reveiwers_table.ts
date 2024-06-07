import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateReviewers extends BaseSchema {
  protected tableName = 'reviewers' // Fix table name

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('reviewer_id') // Fix column name
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('rating')
      table.string('name')
      table.text('comment') // Fix column name
      table
        .integer('umkm_data_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('umkm_data')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at', { useTz: true }) // Add { useTz: true }
      table.timestamp('updated_at', { useTz: true }) // Add { useTz: true }
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}