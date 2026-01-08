import mongoose, { Schema, Types, Document } from 'mongoose';

/**
 * IEnrollment - Document interface for TypeScript
 * Per Mongoose docs: Use `Types.ObjectId` in document interfaces
 * Use `Schema.Types.ObjectId` only in schema definitions
 */
export interface IEnrollment extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    progress: number;
    completedLessons: Types.ObjectId[];
    isCompleted: boolean;
    enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        // Schema definition uses Schema.Types.ObjectId
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        progress: { type: Number, default: 0 },
        completedLessons: [{ type: Schema.Types.ObjectId }],
        isCompleted: { type: Boolean, default: false },
        enrolledAt: { type: Date, default: Date.now },
    }
);

// Prevent double enrollment
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export default Enrollment;
