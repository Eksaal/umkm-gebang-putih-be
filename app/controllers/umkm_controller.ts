import { HttpContext } from '@adonisjs/core/http'
import UmkmData from '#models/umkm_data'
import UmkmPicture from '#models/umkm_picture'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { responseUtil } from '../../helper/response_util.js'

export default class UmkmController {
  public async index({ response }: HttpContext) {
    try {
      const umkmDatas = await UmkmData.all()
      const results = []

      for (const data of umkmDatas) {
        const pictures = await UmkmPicture.query().where('umkmDataId', data.id)
        const formattedPictures = pictures.map(picture => picture.picturePath)
        
        results.push({
          id: data.id,
          name: data.name,
          category: data.category,
          address: data.businessAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          pictures: formattedPictures
        })
      }

      return responseUtil.success(response, results, 'Data and pictures retrieved successfully')
    } catch (error) {
      console.error(error)
      return responseUtil.notFound(response, 'An error occurred while retrieving data and pictures')
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const data = await UmkmData.findOrFail(params.id);
      const pictures = await UmkmPicture.query().where('umkmDataId', data.id);
      let result = {
        ...data.toJSON(), // Convert model instance to plain object
        pictures: pictures.map(picture => picture.toJSON()) // Convert each picture to plain object
      };
      return responseUtil.success(response, result);
    } catch (error) {
      return responseUtil.notFound(response, 'UmkmData not found');
    }
  }

  public async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().trim(),
      category: vine.string().trim(),
      business_address: vine.string().trim(),
      business_contact: vine.string().trim(),
      contact_name: vine.string().trim(),
      opening_hours: vine.string().trim(),
      services: vine.string().trim(),
      payment_methods: vine.string().trim(),
      facilities: vine.string().trim(),
      latitude: vine.number(),
      longitude: vine.number(),
      min_price: vine.string().trim(),
      max_price: vine.string().trim(),
    })

    const messages = new SimpleMessagesProvider({
      'required': 'The {{ field }} field is required.'
    })

    try {
      const data = await vine.compile(schema).validate(request.all(), { messagesProvider: messages })
      console.log(data)

      const created_data = await UmkmData.create({
        name: data.name,
        category: data.category,
        businessAddress: data.business_address,
        businessContact: data.business_contact,
        contactName: data.contact_name,
        openingHours: data.opening_hours,
        services: data.services,
        paymentMethods: data.payment_methods,
        facilities: data.facilities,
        latitude: data.latitude,
        longitude: data.longitude,
        minPrice: data.min_price,
        maxPrice: data.max_price,
      })

      return responseUtil.created(response, created_data.id)
    } catch (error) {
      console.log(error)
      return response.badRequest(error.messages)
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const data = await UmkmData.findOrFail(params.id)
      await data.delete()

      return responseUtil.noContent(response, 'Resource deleted successfully')
    } catch (error) {
      return responseUtil.notFound(response, 'UmkmData not found')
    }
  }
}
