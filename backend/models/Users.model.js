import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, allowNull: false },
    password: { type: String, required: true, allowNull: false },
});

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('User', userSchema);
