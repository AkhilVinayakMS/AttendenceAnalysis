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

// var mailOptions = {
//   from: 'correspond.akhil@gmail.com',
//   to: 'msakhilvinayak@gmail.com',
//   subject: 'Absent details Sending Email using Node.js',
//   text: 'You were absent in class!'
// };
fs.readdirSync(__dirname).forEach(file => {
    //console.log(file)
    if(file.indexOf('.csv')!= -1){
        console.log(file)
        filenamesArray.push(file);
    }
    
  });
let dataArray =[]
filenamesArray.forEach(filename => {
fs.createReadStream(filename)
  .pipe(csv())
  .on('data', (row) => {
      dataArray.push(row)
  })
  .on('end', () => {
    console.log('CSV file successfully processed');

  });
})
const nameAttendernceMap ={}
// {
//     monica:{
//         id:1,
//         email:kdkk@dkj.com,
//         attendenceCount:0
//     },
//     joey:{
//         id:2,
//         email:k22dkk@dkj.com,
//         attendenceCount:0
//     }
// }
setTimeout(()=>{
//console.log(dataArray)
console.log('\n\n************** Analysing Data Starts **************')
dataArray.forEach(singleData =>{

if(typeof nameAttendernceMap[singleData.Name] == 'undefined'){
    let attendenceCount =singleData.Status == 'P'? 1:0
    const tempObj={
        id:singleData.Id,
        email: singleData.mailId,
        attendenceCount:attendenceCount
    }
    if(singleData.Name != 'undefined' && singleData.Name != undefined ){
    nameAttendernceMap[singleData.Name] = tempObj
    }
}else{
    if(singleData.Status == 'P')
    nameAttendernceMap[singleData.Name].attendenceCount +=1
}

})

let totalNumberOfWorkingDays= filenamesArray.length;
console.log(`\nAttendence details submitted for ${totalNumberOfWorkingDays} day(s)`)
console.log(`\n\nMinimum number of days in which student should be present: ${Math.floor(totalNumberOfWorkingDays/2)}`)
let names= Object.keys(nameAttendernceMap);
names.forEach(name=>{
    if(nameAttendernceMap[name].attendenceCount<Math.floor(totalNumberOfWorkingDays/2)){
        console.log(`\nWe found ${name} 's attendence less than the required minimum`)
        console.log(`sending mail to ${name}`)
        // sendAsynchronousMail({
        //     from: 'correspond.akhil@gmail.com',
        //     to: nameAttendernceMap[name].email,
        //     subject: `Attendence Alert for ${name}`,
        //     text: 'We are informing you that Your attendence is less than the required minimum. Please contact administrative office.'
        // })
    }
})
//console.log(nameAttendernceMap)
},3000)


function sendAsynchronousMail(mailOptions){
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent successfully to ${mailOptions.to}: ` + info.response);
        }
      });
}