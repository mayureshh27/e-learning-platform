import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * ILesson - Subdocument interface for lessons within a module
 */
export interface ILesson {
    _id?: Types.ObjectId;
    title: string;
    type: 'video' | 'text';
    content: string;
    videoUrl?: string;
    videoPublicId?: string; // Cloudinary public_id for video
    duration?: number;
    isFree?: boolean;
}

/**
 * IModule - Subdocument interface for modules within a course
 */
export interface IModule {
    _id?: Types.ObjectId;
    title: string;
    lessons: ILesson[];
}

/**
 * ICourse - Document interface for TypeScript
 * Per Mongoose docs: Use `Types.ObjectId` in document interfaces
 */
export interface ICourse extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    instructor: Types.ObjectId;
    modules: IModule[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'text'], default: 'video' },
    content: { type: String },
    videoUrl: { type: String },
    videoPublicId: { type: String }, // Cloudinary public_id
    duration: { type: Number },
    isFree: { type: Boolean, default: false },
});

const moduleSchema = new Schema<IModule>({
    title: { type: String, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        thumbnail: { type: String },
        category: { type: String, default: 'general' },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        modules: [moduleSchema],
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for search
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
