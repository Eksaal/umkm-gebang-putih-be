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


  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
  
    const reviewerId = user.id
  
    const data = await vine
      .compile(
        vine.object({
          umkmDataId: vine.number(),
          rating: vine.number(),
          coment : vine.string(),
          name: vine.string(),
          reviewerId: vine.number().optional(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
        }),
      })
  
    const existingReview = await Reveiwer.query()
      .where('reviewerId', reviewerId)
      .where('umkmDataId', data.umkmDataId)
      .first()
  
    if (existingReview) {
      return responseUtil.noContent(response, 'You have already reviewed this UMKM')
    }

    data.reviewerId = reviewerId
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


 
  public async showByUmkmDataId({ params, response }: HttpContext) {
    const umkmDataId = params.id;
  
    const reviews: any = await Reveiwer.query().where('umkmDataId', umkmDataId);
    const totalReviews = reviews.length;
  
    if (totalReviews === 0) {
      return responseUtil.notFound(response, 'No reviews found for the specified UMKM Data ID');
    }
  
    const ratingCounts: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
  
    const totalRatingSum = reviews.reduce((sum : any, review : any) => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
      return sum + review.rating;
    }, 0);
  
    const averageRating = totalRatingSum / totalReviews;
  
    const responseData = {
      totalReviews,
      averageRating,
      ratingCounts,
      reviews,
    };
  
    return responseUtil.success(response, responseData, 'Reviews retrieved successfully');
  }
  
}
