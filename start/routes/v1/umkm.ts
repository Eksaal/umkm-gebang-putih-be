const UmkmController = () => import('#controllers/umkm_controller')
import router from '@adonisjs/core/services/router'

export default function umkmRoutes(){
    router.group(() => {
        router.get('/', [UmkmController, 'index'])
        router.post('/', [UmkmController,'store'])
        router.get('/:id', [UmkmController,'show'])
        router.delete('/:id', [UmkmController, 'destroy'])
    }).prefix('/umkm')
}