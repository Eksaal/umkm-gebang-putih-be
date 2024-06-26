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
  declare businessAddress: string

  @column()
  declare businessContact: string

  @column()
  declare contactName: string

  @column()
  declare openingHours: string

  @column()
  declare services: string

  @column()
  declare paymentMethods: string

  @column()
  declare facilities: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare minPrice: string

  @column()
  declare maxPrice: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}