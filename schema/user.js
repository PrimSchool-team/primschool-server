exports = module.exports = function (app, mongoose) {
    var userSchema = new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        firstName: String,
        lastName: String,
        isActive: Boolean,
        roles: [{type: String, enum: ['admin', 'student', 'teacher', 'chief']}],
        groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
        school: {type: mongoose.Schema.Types.ObjectId, ref: 'School'}
    });
    userSchema.index({username: 1}, {unique: true});
    userSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('User', userSchema);
};