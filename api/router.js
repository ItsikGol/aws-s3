const express = require('express');
const router = express.Router();
require('dotenv').config();
const AWS = require('aws-sdk')


const KEY_ID = process.env.KEY_ID;
const SECRET_KEY =  process.env.SECRET_KEY;
const BUCKET_NAME =  process.env.BUCKET_NAME;

var region ='';

const s3 = new AWS.S3({
    accessKeyId: KEY_ID,
    secretAccessKey: SECRET_KEY,
});

const params = {
    Bucket: BUCKET_NAME
}




router.get('/api/getAllFile', (req, res) => {

    s3.getBucketLocation(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {    
            region = "."+ data.LocationConstraint; 
            console.log( data.LocationConstraint);
           
            s3.listObjects(params, function(err2, data2) {
                if (err2) {     
                console.log("Error", err2);
                } else {

                    var obj = {
                        data: []
                    };
                    
                    for(var i=0 ; i< data2.Contents.length; i++){
    
                        if(!data2.Contents[i].Key.endsWith('/') ){
                            var link = `https://${data2.Name}.s3${region}.amazonaws.com/${data2.Contents[i].Key}`
                            var lastModified= data2.Contents[i].LastModified;
                            var eTag = data2.Contents[i].ETag;
                            var nameFile = data2.Contents[i].Key;

                            obj.data.push({link: link, lastModified:lastModified, eTag:eTag, nameFile: nameFile});
                            //console.log("Link: ", link + "  lastModified: "+ lastModified);
                        }
                    }
                   //var json = JSON.stringify(obj);
                    console.log(obj);
                   // console.log("data", data2);
                    return res.status(200).json(obj.data);
                }
            });
        }
    });
});

router.get('/api/getBucketLocation', (req, res) => { 
    s3.getBucketLocation(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {         
            console.log( data.LocationConstraint);
            return res.json(data);
        }})
    
});


router.get('', (req, res) => { 
    res.json('hello world !! 4');
});


module.exports = router;