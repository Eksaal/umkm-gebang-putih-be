import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Reviewer extends BaseModel {
  @column({ isPrimary: true })
 declare id: number

  @column()
 declare reviewerId: number

  @column()
 declare name: string

  @column()
 declare comment: string // Fix typo

  @column()
 declare umkmDataId: number

  @column()
 declare rating: number

  @column.dateTime({ autoCreate: true })
 declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
 declare updatedAt: DateTime
}
