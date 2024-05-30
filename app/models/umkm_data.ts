import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UmkmData extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: string

  @column()
  declare product_type: string

  @column()
  declare business_type: string

  @column()
  declare business_address: string

  @column()
  declare business_contact: string

  @column()
  declare contact_name: string

  @column()
  declare opening_days: string

  @column()
  declare special_closing_days: string

  @column()
  declare opening_hours: string

  @column()
  declare services: string

  @column()
  declare payment_methods: string

  @column()
  declare facilities: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare food_price: string

  @column()
  declare drink_price: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}