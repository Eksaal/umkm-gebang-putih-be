import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import { middleware } from './kernel.js'
import authRoutes from './routes/v1/auth.js'
import reviewerRoutes from './routes/v1/reviewer.js'
import umkmRoutes from './routes/v1/umkm.js'
import pictureRoutes from './routes/v1/picture.js'

router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to UMKM Gebang Putih',
  })
})
  
router.group(() => {
  authRoutes()
  router.group(() => {
    router.group(() => {
        umkmRoutes()
        reviewerRoutes()
        pictureRoutes()
    }).middleware(middleware.verifiedEmail())
  }).middleware(middleware.auth({ guards: ['api'] }))

}).prefix('/api/v1')