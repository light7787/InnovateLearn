const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

require('dotenv').config();

const createToken = (_id)=>{
    return jwt.sign(
        {_id}, //Payload
        process.env.SECRET,//Secret from environment variables
        {expiresIn:'3d'}// Token expiry time
    )

};

const loginUser = async(req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.status(200).json({email:user.email,token});
    }catch(error){
        res.status(400).json({error:error.message});
    }
    
}

const signUpUser = async(req,res)=>{
    const {email,password} = req.body;
try{
    const user = await User.signup(email,password);
    const token = createToken(user._id);
    res.status(200).json({email,token});

}catch(error){
   res.status(400).json({error:error.message});
}


   
}
const getUser = async (req, res) => {
    const users = await User.find({})
    try{
        res.status(200).json(users);

    }catch(error){
        res.status(400).json({error:error.message});

    }
   
};

const badgeGenerator = async (req, res) => {
    const { email, badge } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Add the badge if it doesn't already exist
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
        await user.save();
      }
  
      res.status(200).json({ message: "Badge added successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error adding badge", error });
    }
}

const updateUser = async (req, res) => {
        const { userId, questionId } = req.body;
      
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Check if the question exists in the user's question list
          const questionIndex = user.questions.findIndex(
            (q) => q.questionId === questionId
          );
      
          if (questionIndex === -1) {
            // If the question doesn't exist, add it with status 'right'
            user.questions.push({ questionId, status: 'right' });
          } else {
            // If the question exists, update its status to 'right'
            user.questions[questionIndex].status = 'right';
          }
      
          await user.save();
          res.status(200).json({ message: 'Question marked as done' });
        } catch (error) {
          console.error('Error marking question as done:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };

 const getsingleuser = (async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('questions.questionId'); // populate the questionId to get question details
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });   

  const removeQuestion = 
   async (req, res) => {
      const { userId, questionId } = req.body;
    
      try {
        // Remove the question from the user's completed list
        await User.updateOne(
          { _id: userId },
          { $pull: { questions: { questionId } } }
        );
        res.status(200).json({ message: 'Question removed successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error removing question', error });
      }
    }
    
  
module.exports = {loginUser,signUpUser,getUser,badgeGenerator,updateUser,getsingleuser,removeQuestion};