const kycModel = require("../Model/kycModel");
const userModel = require("../Model/userModel"); // Ensure this is imported

// Function to create KYC
const createKyc = async (req, res) => {
  const { frontPix, backPix, nationality } = req.body;
  const user = req.user; // This contains { id, iat, exp }

  // Validate required fields
  if (!frontPix || !backPix || !nationality) {
    return res
      .status(400)
      .json({
        error: "All fields (frontPix, backPix, nationality) are required",
      });
  }

  try {
    // Ensure user ID is a valid MongoDB ObjectId
    if (!user.id || user.id.length !== 24) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Create the KYC record
    const kyc = new kycModel({ frontPix, backPix, nationality, user: user.id });
    const savedKyc = await kyc.save();

    // Update the user's KYC reference
    await userModel.findByIdAndUpdate(
      user.id,
      { kyc: savedKyc._id },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "KYC created successfully", kycId: savedKyc._id });
  } catch (error) {
    console.error("KYC Creation Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while creating KYC" });
  }
};

module.exports = { createKyc };
