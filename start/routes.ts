import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import { middleware } from './kernel.js'
import authRoutes from './routes/v1/auth.js'
import reviewerRoutes from './routes/v1/reviewer.js'
import umkmRoutes from './routes/v1/umkm.js'
import pictureRoutes from './routes/v1/picture.js'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to UMKM Gebang Putih',
  })
})

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
  
router.group(() => {
  authRoutes()
  umkmRoutes()
  router.group(() => {
    reviewerRoutes()
    pictureRoutes()
  }).middleware(middleware.auth({ guards: ['api'] }))

}).prefix('/api/v1')