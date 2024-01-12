import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    avatar:{
        type: String,
        default: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F012%2F850%2F918%2Foriginal%2Fline-icon-for-avtar-vector.jpg&tbnid=wvD9sz-QOl47jM&vet=12ahUKEwiiscDSq9GDAxXVTPUHHQepCZQQMygUegUIARCfAQ..i&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F12850918-line-icon-for-avtar&docid=iiJ95Pc-syqy0M&w=1920&h=1920&q=avtar&ved=2ahUKEwiiscDSq9GDAxXVTPUHHQepCZQQMygUegUIARCfAQ'
    }

}, { timestamps: true });

const User = mongoose.model('User',userSchema);

export default User;