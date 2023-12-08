// Import core libraries
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import helmet from 'helmet'

//Import seeder files
import { seeder } from 'nestjs-seeder'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './features/tickets/schemas/ticket.schema'
import { TicketSeeder } from './features/tickets/tickets.seeder'
import { Category, CategorySchema } from './features/categories/schemas/category.schema'
import { CategorySeeder } from './features/categories/category.seeder'
import { UserSeeder } from './features/users/users.seeder'
import { User, UserSchema } from './features/users/schemas/user.schema'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: true })

  // Setting up the app
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())

  // Setting OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Marissa Vargas | RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs/api', app, swaggerDocument)

  if(process.env.NODE_ENV === 'development') {
    const configService = app.get(ConfigService)
    const uri = configService.get<string>('mongodb.uri')

    seeder({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema}]),
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema}]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
      ]
    }).run([UserSeeder, TicketSeeder, CategorySeeder])
  }

  await app.listen(3000)
}
bootstrap()
