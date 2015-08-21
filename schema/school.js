exports = module.exports = function (app, mongoose) {
    var schoolSchema = new mongoose.Schema({
        name: String,
        owner: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' }
        }
    });
    schoolSchema.index({ name: 1 }, { unique: true });
    schoolSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('School', schoolSchema);
};