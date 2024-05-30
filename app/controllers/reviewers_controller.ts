import type { HttpContext } from '@adonisjs/core/http'
import Reveiwer from '#models/reveiwer'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class ReviewersController {
  public async index({ response }: HttpContext) {
    const reviewers = await Reveiwer.all()
    return responseUtil.success(response, reviewers, 'Reviewers retrieved successfully')
  }

  public async show({ params, response }: HttpContext) {
    const reviewer = await Reveiwer.find(params.id)
    if (!reviewer) {
      return responseUtil.notFound(response, 'Reviewer not found')
    }
    return responseUtil.success(response, reviewer, 'Reviewer retrieved successfully')
  }

  public async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          reviewerId: vine.number(),
          umkmDataId: vine.number(),
          rating: vine.number(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    const reviewer = await Reveiwer.create(data)

    return responseUtil.created(response, reviewer, 'Reviewer created successfully')
  }

  public async update({ params, request, response }: HttpContext) {
    const reviewer = await Reveiwer.find(params.id)
    if (!reviewer) {
      return responseUtil.notFound(response, 'Reviewer not found')
    }

    const data = await vine
      .compile(
        vine.object({
          reviewerId: vine.number().optional(),
          umkmDataId: vine.number().optional(),
          rating: vine.number().optional(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })

    reviewer.merge(data)
    await reviewer.save()

    return responseUtil.success(response, reviewer, 'Reviewer updated successfully')
  }

  public async destroy({ params, response }: HttpContext) {
    const reviewer = await Reveiwer.find(params.id)
    if (!reviewer) {
      return responseUtil.notFound(response, 'Reviewer not found')
    }

    await reviewer.delete()
    return responseUtil.noContent(response, 'Reviewer deleted successfully')
  }

  public async getReviewByUmkmDataId({ params, response }: HttpContext) {
    const umkmDataId = params.umkmDataId
    
    const reviews = await Reveiwer.query().where('umkmDataId', umkmDataId)
    const totalReviews = reviews.length

    if (totalReviews === 0) {
      return responseUtil.notFound(response, 'No reviews found for the specified UMKM Data ID')
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const responseData = {
      totalReviews,
      averageRating,
      reviews,
    }

    return responseUtil.success(response, responseData, 'Reviews retrieved successfully')
  }
}
