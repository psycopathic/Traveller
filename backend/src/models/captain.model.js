import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const CaptainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match:[ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
  },
   password: {
        type: String,
        required: true,
        select: false,
    },
    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [ 3, 'Color must be at least 3 characters long' ],
        },
        plate: {
            type: String,
            required: true,
            minlength: [ 3, 'Plate must be at least 3 characters long' ],
        },
        capacity: {
            type: Number,
            required: true,
            min: [ 1, 'Capacity must be at least 1' ],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: [ 'car', 'motorcycle', 'auto' ],
        }
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
});

CaptainSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

CaptainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

CaptainSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
};


const CaptainModel = mongoose.model('Captain', CaptainSchema);

export default CaptainModel;
