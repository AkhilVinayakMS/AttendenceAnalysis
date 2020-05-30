const csv = require('csv-parser');
const fs = require('fs');
let filenamesArray =[];
const testFolder = '/';
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'correspond.akhil@gmail.com',
    pass: 'Akhil@123'
  }
});

var mailOptions = {
  from: 'correspond.akhil@gmail.com',
  to: 'msakhilvinayak@gmail.com',
  subject: 'Absent details Sending Email using Node.js',
  text: 'You were absent in class!'
};
// fs.readdirSync(__dirname).forEach(file => {
//     //console.log(file)
//     if(file && file.indexOf('csv'>0)){
//         filenamesArray.push(file);
//     }
    
//   });
let dataArray =[]
// filenamesArray.forEach(filename => {
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
      dataArray.push(row)
   //console.log(row);
  })
  .on('end', () => {
    console.log(dataArray)
    console.log('CSV file successfully processed');
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  });
// })
console.log(dataArray)



