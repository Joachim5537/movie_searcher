const express = require('express');
const router = express.Router();
// const Post = require('models/schema');

// router.get('/',(req,res) => {
//     res.send('test');
// })

// router.post('/',(req,res) => {
//     const post = Post({
//         title: req.body.title
//     });

//     post.save()
//     .then(data=>{
//         res.json(data);
//     })
//     .catch(err => {
//         res.json({message:err})
//     })
// });

module.exports = router;