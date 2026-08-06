const Service = require("../models/Service");

const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    const service = await Service.create({
      provider: req.user._id,
      name,
      description,
      duration,
      price,
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({
      provider: req.params.providerId,
      isActive: true,
    });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this service" });
    }
    const { name, description, duration, price, isActive } = req.body;
    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (duration) service.duration = duration;
    if (price) service.price = price;
    if (isActive !== undefined) service.isActive = isActive;

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this service" });
    }
    await service.deleteOne();
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getProviderServices,
};
