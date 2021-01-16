
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

export const transporter = nodemailer.createTransport(smtpTransport({    
  service: 'gmail',
  host: 'smtp.gmail.com', 
  auth: {        
    user: 'housely.noreply@gmail.com',        
    pass: '8J2K9e/~%)k>D@Jy'    
  }
}));