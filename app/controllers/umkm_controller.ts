import { HttpContext } from '@adonisjs/core/http'
import UmkmData from '#models/umkm_data'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { responseUtil } from '../../helper/response_util.js'

export default class UmkmController {
  public async index({ request, response }: HttpContext) {
    const { name, category } = request.qs()
    const query = UmkmData.query()

    if (name) {
      query.where('name', 'like', `%${name}%`);
    }
    
    if (category) {
      query.where('category', 'like', `%${category}%`);
    }
    
    const UmkmDatas = await query.exec();

    return responseUtil.success(response, UmkmDatas)
  }

  public async show({ params, response }: HttpContext) {
    try {
      const data = await UmkmData.findOrFail(params.id)
      return responseUtil.success(response, data)
    } catch (error) {
      return responseUtil.notFound(response, 'UmkmData not found')
    }
  }

  public async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().trim(),
      category: vine.string().trim(),
      product_type: vine.string().trim(),
      business_type: vine.string().trim(),
      business_address: vine.string().trim(),
      business_contact: vine.string().trim(),
      contact_name: vine.string().trim(),
      opening_days: vine.string().trim(),
      special_closing_days: vine.string().trim().nullable(),
      opening_hours: vine.string().trim(),
      services: vine.string().trim(),
      payment_methods: vine.string().trim(),
      facilities: vine.string().trim(),
      latitude: vine.number(),
      longitude: vine.number(),
      food_price: vine.string().trim(),
      drink_price: vine.string().trim(),
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
        productType: data.product_type,
        businessType: data.business_type,
        businessAddress: data.business_address,
        businessContact: data.business_contact,
        contactName: data.contact_name,
        openingDays: data.opening_days,
        specialClosingDays: data.special_closing_days ? data.special_closing_days : undefined,
        openingHours: data.opening_hours,
        services: data.services,
        paymentMethods: data.payment_methods,
        facilities: data.facilities,
        latitude: data.latitude,
        longitude: data.longitude,
        foodPrice: data.food_price,
        drinkPrice: data.drink_price,
      })

      console.log("hasil",created_data)

      return responseUtil.created(response, created_data)
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
