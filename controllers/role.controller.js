const authRepo = require("../repository/user.repository");


const findAll = async (req, res) => {
  const data = await authRepo.findAllData(req.body);
  return res.status(data.status).send(data);
};
const Add = async (req, res) => {
  const data = await authRepo.findAllData(req.body);
  return res.status(data.status).send(data);
};


module.exports = {
findAll,
Add
};
