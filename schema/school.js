exports = module.exports = function (app, mongoose) {
    var schoolSchema = new mongoose.Schema({
        name: String
    });
    schoolSchema.index({ name: 1 }, { unique: true });
    schoolSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('School', schoolSchema);
};