const express = require('express');
const {loginUser,signUpUser,getUser, badgeGenerator,updateUser,getsingleuser, removeQuestion} = require('../Controller/userController');

const router = express.Router();

router.post('/login',loginUser);
router.get('/',getUser);

router.post('/signUp',signUpUser);
router.post('/addbadge',badgeGenerator);
router.put('/addquestion',updateUser);
router.get('/:id',getsingleuser);
router.put('/removequestion',removeQuestion);

module.exports = router;