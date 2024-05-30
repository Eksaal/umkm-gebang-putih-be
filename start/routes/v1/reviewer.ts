const ReviewersController = () => import('#controllers/reviewers_controller')
import router from '@adonisjs/core/services/router'

export default function reviewerRoutes(){
    router.group(() => {
        router.get('/', [ReviewersController, 'index'])
        router.post('/', [ReviewersController,'store'])
        router.get('/:id', [ReviewersController,'show'])
        router.get('/umkm/:id', [ReviewersController, 'showByUmkmDataId'])
        router.patch('/:id', [ReviewersController, 'update'])
        router.delete('/:id', [ReviewersController, 'destroy'])
    }).prefix('/reviewers')
}