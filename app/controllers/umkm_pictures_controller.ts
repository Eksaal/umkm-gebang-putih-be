import type { HttpContext } from '@adonisjs/core/http';
import UmkmPicture from '#models/umkm_picture';
import { responseUtil } from '../../helper/response_util.js';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import env from '#start/env'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
});


export default class UmkmPicturesController {

  private checkBase64(base64String: string): string | null {
    const match = base64String.match(/^data:image\/(png|jpg|jpeg);base64,/);
    return match ? match[1] : null;
  }

  public async index({ response }: HttpContext) {
    try {
      const pictures = await UmkmPicture.all();
      return responseUtil.success(response, pictures, 'Pictures retrieved successfully');
    } catch (error) {
      console.error('Error retrieving pictures:', error);
      return responseUtil.notFound(response, 'Error retrieving pictures');
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
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
        });

      const pictureExtension = this.checkBase64(data.picture);
      const menuImageExtension = this.checkBase64(data.menu_image);

      if (!pictureExtension || !menuImageExtension) {
        return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.');
      }

      const picture = await UmkmPicture.create({ umkmDataId: data.id, picturePath: '', menuPicturePath: '' });

      const pictureUploadResult = await cloudinary.uploader.upload(data.picture, {
        folder: `uploads/umkm_pictures/${data.id}`,
        public_id: `${data.id}_${picture.id}_picture`
      });

      const menuImageUploadResult = await cloudinary.uploader.upload(data.menu_image, {
        folder: `uploads/umkm_pictures/${data.id}`,
        public_id: `${data.id}_${picture.id}_menu`
      });

      picture.picturePath = pictureUploadResult.secure_url;
      picture.menuPicturePath = menuImageUploadResult.secure_url;
      await picture.save();

      return responseUtil.created(response, picture, 'Pictures created successfully');
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      return responseUtil.notFound(response, 'Error uploading images to Cloudinary');
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const picture = await UmkmPicture.find(params.id);
      if (!picture) {
        return responseUtil.notFound(response, 'Picture not found');
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
        });

      if (data.picture) {
        const pictureExtension = this.checkBase64(data.picture);
        if (!pictureExtension) {
          return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.');
        }

        const pictureUploadResult = await cloudinary.uploader.upload(data.picture, {
          folder: `uploads/umkm_pictures/${picture.umkmDataId}`,
          public_id: `${picture.umkmDataId}_${picture.id}_picture`
        });

        picture.picturePath = pictureUploadResult.secure_url;
      }

      if (data.menu_image) {
        const menuImageExtension = this.checkBase64(data.menu_image);
        if (!menuImageExtension) {
          return responseUtil.conflict(response, 'Invalid picture format. Only jpg and png are allowed.');
        }

        const menuImageUploadResult = await cloudinary.uploader.upload(data.menu_image, {
          folder: `uploads/umkm_pictures/${picture.umkmDataId}`,
          public_id: `${picture.umkmDataId}_${picture.id}_menu`
        });

        picture.menuPicturePath = menuImageUploadResult.secure_url;
      }

      await picture.save();

      return responseUtil.success(response, picture, 'Pictures updated successfully');
    } catch (error) {
      console.error('Error updating picture:', error);
      return responseUtil.notFound(response, 'Error updating picture');
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const picture = await UmkmPicture.find(params.id);
      if (!picture) {
        return responseUtil.notFound(response, 'Picture not found');
      }

      if (picture.picturePath) {
        const publicId = this.extractPublicId(picture.picturePath);
        await cloudinary.uploader.destroy(publicId);
      }

      if (picture.menuPicturePath) {
        const publicId = this.extractPublicId(picture.menuPicturePath);
        await cloudinary.uploader.destroy(publicId);
      }

      await picture.delete();
      return responseUtil.noContent(response, 'Pictures deleted successfully');
    } catch (error) {
      console.error('Error deleting picture:', error);
      return responseUtil.notFound(response, 'Error deleting picture');
    }
  }

  public async showByUmkmDataId({ params, response }: HttpContext) {
    try {
      const pictures = await UmkmPicture.query().where('umkmDataId', params.id);
      if (pictures.length === 0) {
        return responseUtil.notFound(response, 'No pictures found for the specified UMKM Data ID');
      }
      return responseUtil.success(response, pictures, 'Pictures retrieved successfully');
    } catch (error) {
      console.error('Error retrieving pictures:', error);
      return responseUtil.notFound(response, 'Error retrieving pictures');
    }
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const publicId = parts[parts.length - 1].split('.')[0]; // Get the last part and remove the file extension
    return publicId;
  }
}
