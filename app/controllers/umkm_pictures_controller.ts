import type { HttpContext } from '@adonisjs/core/http'
import UmkmPicture from '#models/umkm_picture'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import fs from 'fs'
import path from 'path'

export default class UmkmPicturesController {
  private async saveFile(base64String: string, filePath: string, fileName: string): Promise<void> {
    const fileBuffer = Buffer.from(base64String.split(',')[1], 'base64') // Split to remove the data URL prefix
    const fullFilePath = path.join(filePath, fileName)
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true })
    }
    await fs.promises.writeFile(fullFilePath, fileBuffer)
  }

  private checkBase64(base64String: string): string | null {
    const match = base64String.match(/^data:image\/(png|jpg|jpeg);base64,/)
    return match ? match[1] : null
  }

  public async index({ response }: HttpContext) {
    const pictures = await UmkmPicture.all()
    return responseUtil.success(response, pictures, 'Pictures retrieved successfully')
  }

  public async show({ params, response }: HttpContext) {
    const picture = await UmkmPicture.find(params.id)
    if (!picture) {
      return responseUtil.notFound(response, 'Picture not found')
    }
    return responseUtil.success(response, picture, 'Picture retrieved successfully')
  }

  public async store({ request, response }: HttpContext) {
    // Validate the incoming request to ensure 'picture' field is provided and is a string
    const data = await vine
      .compile(
        vine.object({
          picture: vine.string(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    const umkmDataId = 1; // Replace with your actual logic for getting the umkmDataId

    // Check the base64 string for a valid format and get the file extension
    const fileExtension = this.checkBase64(data.picture)
    if (!fileExtension) {
      return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.')
    }

    // Create a new UmkmPicture record with a temporary picturePath
    const picture = await UmkmPicture.create({ umkmDataId: umkmDataId, picturePath: '' })

    // Define the file path and name
    const filePath = `uploads/umkm_pictures/${umkmDataId}`
    const fileName = `${umkmDataId}_${picture.id}.${fileExtension}`

    // Save the base64 string as a file on the server
    await this.saveFile(data.picture, filePath, fileName)

    // Update the picturePath in the database with the correct path
    picture.picturePath = path.join(filePath, fileName)
    await picture.save()

    // Respond with a success message and the created picture record
    return responseUtil.created(response, picture, 'Picture created successfully')
  }

  public async update({ params, request, response }: HttpContext) {
    const picture = await UmkmPicture.find(params.id)
    if (!picture) {
      return responseUtil.notFound(response, 'Picture not found')
    }

    const data = await vine
      .compile(
        vine.object({
          picture: vine.string().optional(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    if (data.picture) {
      const fileExtension = this.checkBase64(data.picture)
      if (!fileExtension) {
        return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.')
      }

      const filePath = `uploads/umkm_pictures/${picture.umkmDataId}`
      const fileName = `${picture.umkmDataId}_${picture.id}.${fileExtension}`

      await this.saveFile(data.picture, filePath, fileName)
      picture.picturePath = path.join(filePath, fileName)
    }

    await picture.save()

    return responseUtil.success(response, picture, 'Picture updated successfully')
  }

  public async destroy({ params, response }: HttpContext) {
    const picture = await UmkmPicture.find(params.id)
    if (!picture) {
      return responseUtil.notFound(response, 'Picture not found')
    }

    const filePath = picture.picturePath
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await picture.delete()
    return responseUtil.noContent(response, 'Picture deleted successfully')
  }

  public async showByUmkmDataId({ params, response }: HttpContext) {
    const pictures = await UmkmPicture.query().where('umkmDataId', params.id)
    if (pictures.length === 0) {
      return responseUtil.notFound(response, 'No pictures found for the specified UMKM Data ID')
    }
    return responseUtil.success(response, pictures, 'Pictures retrieved successfully')
  }
}
