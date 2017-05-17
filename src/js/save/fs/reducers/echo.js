// Fill for state items that we don't want a reducer for. combineReducers will
// complain without a reducer for each attribute.
module.exports = state => state || {};