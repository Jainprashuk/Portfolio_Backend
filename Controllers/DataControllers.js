const Form = require('../Model/Form.js'); 

exports.getData = async(req , res)=>{
    try {
        const portfolioItems = await Form.find({});
        res.json(portfolioItems);
      } catch (err) {
        res.status(500).send(err.message);
      }
}

