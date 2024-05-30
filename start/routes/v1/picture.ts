const UmkmPicturesController = () => import('#controllers/umkm_pictures_controller')
import router from '@adonisjs/core/services/router'

export default function pictureRoutes(){
    router.group(() => {
        router.get('/', [UmkmPicturesController, 'index'])
        router.post('/', [UmkmPicturesController,'store'])
        router.get('/:id', [UmkmPicturesController,'show'])
        router.get('/umkm/:id', [UmkmPicturesController,'showByUmkmDataId'])
        router.patch('/:id', [UmkmPicturesController, 'update'])
        router.delete('/:id', [UmkmPicturesController, 'destroy'])
    }).prefix('/pictures')
}