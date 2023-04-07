

let tokenWali = require('jsonwebtoken');

let fs = require('fs')



 // systemjs format
// import flana from flanPath;

// commonJS format
// let some = requre(flanPath)

let myExpress = require('express');

let multer = require('multer');

const meriFileSetting = multer.diskStorage({
    destination: function (req, file, cb) {



        let path = './my-uploads/'+req.body.name;
        
        let folderParaHua = fs.existsSync(path);

        if(folderParaHua  == false){
            fs.mkdir(path,function(){
                
                cb(null, path);

            });
        }else{
            cb({code:100, message:"USer already h "}, null);
        }


    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
  const upload = multer({ storage: meriFileSetting })

//   middle-wares
//   

// request-response system
// REST API

let meriApp = myExpress();

// POST, create data
// PUT, update data
// GET, receive data
// DELETE, delete data

meriApp.use(myExpress.json());

let users = [];


// route ki 2 types
// UI routes
// data routes


// meriApp.use(function(req, res, cb){
//     if(req.query.roll == undefined){
//         res.end("roll number provide karen")
//     }else{
//         cb();
//     }
// })

// meriApp.get('/result/:roll', function(req, res){
//     console.log("yeh roll number h "+req.params.roll)
//     res.end("result agya "+req.params.roll)
// })

// meriApp.get('/cat', function(req, res){
//     res.end("code chaling");
// })


// meriApp.use(function(err, req, res, cb){
//     res.end("aagey nahi jana")
// })

// meriApp.get('/checking', function(req, res, cb){

//     cb();

// }, function(req, res, cb){

//     cb();

// }, function(req, res){
//     console.log("code chaling ow");
//     res.end("code chlya wa");
// })

meriApp.post('/session-check', async (req, res)=>{


    tokenWali.verify(req.body.token, "apple sweet", function(err, dataObj){

    if(dataObj){

            let user = users.find(user=>user.id == dataObj.userKiId);

            res.json(user);
            console.log(true)
        }

    })


});

meriApp.post('/login', function(req, res){

    let userMilgya = users.find(user=>user.name == req.body.name && user.password ==  req.body.password);
   
    if(userMilgya){

        tokenWali.sign( {userKiId:userMilgya.id}, "apple sweet", {expiresIn:"2d"},function(err, myToken){

            res.json({
                userMilgya,
                myToken
            });
            

        });

    }
   

});

meriApp.put('/user-update', function(req, res){

    let userIndex = users.findIndex(user=>user.id == req.body.id);

    let user = users[userIndex];

    fs.renameSync('./my-uploads/'+user.name, './server/my-uploads/'+req.body.name);


    users[userIndex] = req.body;

    res.json({
        success:true
    })

})

meriApp.get('/get-user-by-id', function(req, res){

   let userMilgya = users.find(user=> user.id == req.query.id);
   res.json(userMilgya);

});

meriApp.delete('/user-delete', function(req, res){

    let user = users.find(user=>user.id == req.query.anc);

    fs.rmSync('./my-uploads/'+user.name, { recursive: true, force: true });
        
    users = users.filter(user=>user.id != req.query.anc);
    res.json({success:true})



    

    console.log(req.query.anc);

});

meriApp.post('/create-user', function(req, res){

    // req.body.pic = req.files[0].originalname;

    users.push(req.body);
    console.log(req.body)
    res.end("data chal agya");

});

meriApp.get('/abc', function(req, res){

    res.json(users);

    // res.end("m5 is chaling")
})

// meriApp.get('/abc', function(reqeust, response){
//     response.json({
//         name:"khurram",
//         city:"FSD"
//     });
//     // response.sendfile('./server/data.jpg');
//     // response.end("haha")
// });

meriApp.use(myExpress.static('./build'))
meriApp.use(myExpress.static('./my-uploads'));

meriApp.use(function(err, req, res, cb){

    switch(err.code){

        case 100:
            res.json({
                message:"USER ALERADY EXIST",
                code:300,
                helpingCode:299
            })
            break;

    }
   
})

meriApp.get('*', function(req, res){

    res.sendfile('./build/index.html');

});

meriApp.listen(3002, function(){
    console.log("server chaling now");
})

// let data = require('./cooking');


// console.log("code is chaling");