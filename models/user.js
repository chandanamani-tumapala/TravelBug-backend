const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');

const userSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    // firstname: {
    //     type: String,
    //     required: true
    // },
    // middlename: {
    //     type: String
    // },
    // lastname: {
    //     type:String,
    //     required: true
    // },
    // dob: {
    //     type: Date,
    //     required: true
    // },
    username: {
        type:String,
        required: true
    },
    // password: {
    //     type: String,
    //     required: true
    // }
});
userSchema.plugin(passportLocalMongoose);

const Users= mongoose.model('Users', userSchema);
module.exports= Users;