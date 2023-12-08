import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, HydratedDocument, ObjectId} from "mongoose"
import { Transform } from "class-transformer"
import { Factory } from "nestjs-seeder"

@Schema()
export class Category extends Document {
    @Transform(({ value }) => value.toString())
    _id: ObjectId

    @Factory('school')
    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    category: string

    @Factory(faker => faker.lorem.paragraph(1))
    @Prop()
    description?: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)

export type CategoryDocument = HydratedDocument<Category>
