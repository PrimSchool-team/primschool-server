/**
 *  This file is part of PrimSchool project.
 *
 *  PrimSchool is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This Web application is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with PrimSchool.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright     Copyright (c) PrimSchool
 * @link          http://primschool.org
 * @license       http://www.gnu.org/licenses/ GPLv3 License
 */

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