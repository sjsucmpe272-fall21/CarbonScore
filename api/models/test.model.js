var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const testSchema = new Schema({
});

module.exports.Test = mongoose.model('Test', testSchema, 'Test');