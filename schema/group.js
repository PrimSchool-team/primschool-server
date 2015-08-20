exports = module.exports = function (app, mongoose) {
    var groupSchema = new mongoose.Schema({
        name: String,
        sigle: String,
        school: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
            name: { type: String, default: '' }
        },
        owner: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' }
        }
    });
    groupSchema.index({ name: 1 });
    groupSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Group', groupSchema);
};