'use strict';

exports = module.exports = function (app, mongoose) {
    require('./schema/school')(app, mongoose);
    require('./schema/user')(app, mongoose);
    require('./schema/group')(app, mongoose);
};