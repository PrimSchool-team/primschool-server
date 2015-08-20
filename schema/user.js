exports = module.exports = function (app, mongoose) {
    var userSchema = new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        firstName: String,
        lastName: String,
        isActive: Boolean
    });
    userSchema.index({ username: 1 }, { unique: true });
    userSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('User', userSchema);
};