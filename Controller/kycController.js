const kycModel = require("../Model/kycModel");

//function to create kyc
const createKyc = async (req, res) => {
  const body = req.body;
  const user = req.user;

  try {
    //create the kyc
    const kyc = new kycModel({ ...body, user });
    const saveKyc = await kyc.save();

    //update the user model kyc field
    await userModel.findByIdAndUpdate(user, { kyc: saveKyc.id }, { new: true });
    res.send("kyc created successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};

module.exports = { createKyc };
