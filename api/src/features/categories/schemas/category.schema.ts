import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, HydratedDocument } from "mongoose"

@Schema()
export class Category extends Document {
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
