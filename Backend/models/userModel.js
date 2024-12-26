const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    courses:{
        type:[String],
        default:[]
    },
    badges:{
        type:[String],
        default:[]
    }, 
    questions: [
        {
          questionId: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ['not-done', 'right'], // Only two states: 'not-done' and 'right'
            default: 'not-done',
          },
        },
      ]
},{timestamps:true});

userSchema.statics.signup = async function(email,password){
     
    if (!email || !password) {
        throw new Error('All fields must be filled');
      }

      if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
      }  

      if (!validator.isStrongPassword(password)) {
        throw new Error('Password not strong enough');
      } 


    const exists = await this.findOne({email});

if(exists){
    throw new Error('Email already in use');
}
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password,salt);

const user = await this.create({email,password:hash});
return user;
}

userSchema.statics.login = async function(email,password){
    if(!email || !password){
        throw new Error("All fields must be filled");
    }
    const user = await this.findOne({email});
    if(!user){
        throw new Error("Incorrect email");
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        throw new Error("Incorrect Password");
    }
    return user;
}

module.exports = mongoose.model('User',userSchema);