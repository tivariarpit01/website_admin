import Service from "../models/Service.js";

// ✅ Create
export const createService = async (req, res) => {
  try {
    const { title, description, features, technologies, cta } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const image = req.file.path.replace(/\\/g, "/");

    const service = new Service({
      title,
      description,
      image,
      features: features ? JSON.parse(features) : [],
      technologies: technologies ? JSON.parse(technologies) : [],
      cta: cta ? JSON.parse(cta) : undefined
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
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
// ✅ Update
// ✅ Update
export const updateService = async (req, res) => {
  try {
    const { title, description, features, technologies, cta } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // Parse JSON strings from Postman
    if (features) updateData.features = JSON.parse(features);
    if (technologies) updateData.technologies = JSON.parse(technologies);
    if (cta) updateData.cta = JSON.parse(cta);

    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update service",
      error: err.message
    });
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
