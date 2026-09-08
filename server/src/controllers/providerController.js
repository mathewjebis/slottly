const User = require("../models/User");
const Service = require("../models/Service");

const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select(
      "name email",
    );

    const providersWithServices = await Promise.all(
      providers.map(async (provider) => {
        const services = await Service.find({
          provider: provider._id,
          isActive: true,
        });
        return {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          services,
        };
      }),
    );

    res.status(200).json(providersWithServices);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await User.findById(req.params.providerId).select(
      "name email",
    );
    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    const services = await Service.find({
      provider: provider._id,
      isActive: true,
    });

    res.status(200).json({
      _id: provider._id,
      name: provider.name,
      email: provider.email,
      services,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = { getAllProviders, getProviderById };
