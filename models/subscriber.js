'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let token = global.helpers.token;

let Subscriber = new Schema({
    email: {
        type: String,
        unique: 'Email already exists',
        require: true,
        trim: true
    },
    msv: {
        type: String,
        require: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
});

Subscriber.pre('save', function (next) {
    let self = this;

    if (this.is_active){
        next();
        return;
    }

    token.generateToken().then(
        tokenString => {
            self.token = tokenString;
            console.log(tokenString);

            next();
        }
    ).catch(err => {
        next(err);
    });
});

let handleE11000 = function (error, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Email already exist! Please try another email :)');
    } else {
        next();
    }

};

Subscriber.post('save', handleE11000);

mongoose.model('Subscriber', Subscriber);