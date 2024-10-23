const authRepo = require("../repository/user.repository");


const findAllData = async (req, res) => {
  const data = await authRepo.findAllData(req.body);
  return res.status(data.status).send(data);
};


module.exports = {
findAllData
};
