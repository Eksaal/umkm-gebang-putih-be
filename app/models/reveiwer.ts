import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Reveiwer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare reveiwerId: number

  @column()
  declare name: string

  @column()
  declare coment : string

  @column()
  declare umkmDataId: number

  @column()
  declare rating: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}