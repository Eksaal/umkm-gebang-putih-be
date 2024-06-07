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
    const data = await vine
      .compile(
        vine.object({
          id: vine.number(),
          picture: vine.string(),
          menu_image: vine.string(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    const pictureExtension = this.checkBase64(data.picture)
    const menuImageExtension = this.checkBase64(data.menu_image)

    if (!pictureExtension || !menuImageExtension) {
      return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.')
    }

    const picture = await UmkmPicture.create({ umkmDataId: data.id, picturePath: '', menuPicturePath: '' })

    const filePath = `uploads/umkm_pictures/${data.id}`
    const pictureFileName = `${data.id}_${picture.id}_picture.${pictureExtension}`
    const menuImageFileName = `${data.id}_${picture.id}_menu.${menuImageExtension}`

    await this.saveFile(data.picture, filePath, pictureFileName)
    await this.saveFile(data.menu_image, filePath, menuImageFileName)

    picture.picturePath = path.join(filePath, pictureFileName)
    picture.menuPicturePath = path.join(filePath, menuImageFileName)
    await picture.save()

    return responseUtil.created(response, picture, 'Pictures created successfully')
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
          menu_image: vine.string().optional(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    if (data.picture) {
      const pictureExtension = this.checkBase64(data.picture)
      if (!pictureExtension) {
        return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.')
      }

      const filePath = `uploads/umkm_pictures/${picture.umkmDataId}`
      const pictureFileName = `${picture.umkmDataId}_${picture.id}_picture.${pictureExtension}`

      await this.saveFile(data.picture, filePath, pictureFileName)
      picture.picturePath = path.join(filePath, pictureFileName)
    }

    if (data.menu_image) {
      const menuImageExtension = this.checkBase64(data.menu_image)
      if (!menuImageExtension) {
        return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.')
      }

      const filePath = `uploads/umkm_pictures/${picture.umkmDataId}`
      const menuImageFileName = `${picture.umkmDataId}_${picture.id}_menu.${menuImageExtension}`

      await this.saveFile(data.menu_image, filePath, menuImageFileName)
      picture.menuPicturePath = path.join(filePath, menuImageFileName)
    }

    await picture.save()

    return responseUtil.success(response, picture, 'Pictures updated successfully')
  }

  public async destroy({ params, response }: HttpContext) {
    const picture = await UmkmPicture.find(params.id)
    if (!picture) {
      return responseUtil.notFound(response, 'Picture not found')
    }

    const pictureFilePath = picture.picturePath
    const menuImageFilePath = picture.menuPicturePath

    if (fs.existsSync(pictureFilePath)) {
      fs.unlinkSync(pictureFilePath)
    }

    if (fs.existsSync(menuImageFilePath)) {
      fs.unlinkSync(menuImageFilePath)
    }

    await picture.delete()
    return responseUtil.noContent(response, 'Pictures deleted successfully')
  }

  public async showByUmkmDataId({ params, response }: HttpContext) {
    const pictures = await UmkmPicture.query().where('umkmDataId', params.id)
    if (pictures.length === 0) {
      return responseUtil.notFound(response, 'No pictures found for the specified UMKM Data ID')
    }
    return responseUtil.success(response, pictures, 'Pictures retrieved successfully')
  }
}
