import Service from "../models/Service.js";

// Create
export const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const service = new Service({ title, description, icon });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

// Read All
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Read One
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// Update
export const updateService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to update service" });
  }
};

// Delete
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
