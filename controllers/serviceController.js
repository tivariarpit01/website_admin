import Service from "../models/Service.js";

// ✅ Create
export const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description || !icon) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("🚀 Incoming service:", { title, description, icon });
    console.log("🔐 Admin (from token):", req.admin); // if you're using protect middleware

    const service = new Service({ title, description, icon });
    await service.save();

    console.log("✅ Service created:", service);
    res.status(201).json(service);
  } catch (err) {
    console.error("🔥 Service creation error:", err);
    res.status(500).json({ message: "Failed to create service", error: err.message });
  }
};


// ✅ Read All
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services", error: err.message });
  }
};

// ✅ Read One
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch service", error: err.message });
  }
};

// ✅ Update
export const updateService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update service", error: err.message });
  }
};

// ✅ Delete
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service", error: err.message });
  }
};
