import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, HydratedDocument, ObjectId} from "mongoose"
import { Transform } from "class-transformer"

@Schema()
export class Category extends Document {
    @Transform(({ value }) => value.toString())
    _id: ObjectId

    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    category: string

    @Prop()
    description?: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)

export type CategoryDocument = HydratedDocument<Category>
