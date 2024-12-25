const ComplaintModel = require('../models/complaintModel');

class ComplaintController {
  // Create a new complaint
  static async createComplaint(req, res) {
    console.log(req.body);
    const { complaint } = req.body;
    if (!complaint) {
      return res.status(400).json({ error: 'Complaint text is required' });
    }

    try {
      const newComplaint = await ComplaintModel.createComplaint(complaint);
      res.status(201).json(newComplaint);
    } catch (error) {
      console.error('Error creating complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all complaints
  static async getAllComplaints(req, res) {
    try {
      const complaints = await ComplaintModel.getAllComplaints();
      res.status(200).json(complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a complaint by ID
  static async getComplaintById(req, res) {
    const { id } = req.params;

    try {
      const complaint = await ComplaintModel.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      res.status(200).json(complaint);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a complaint by ID
  static async deleteComplaint(req, res) {
    const { id } = req.params;

    try {
      const deletedComplaint = await ComplaintModel.deleteComplaint(id);
      if (!deletedComplaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      res.status(200).json({ message: 'Complaint deleted successfully', complaint: deletedComplaint });
    } catch (error) {
      console.error('Error deleting complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resolveComplaint(req, res) {
    const { id } = req.params;

    try {
      const resolvedComplaint = await ComplaintModel.resolveComplaint(id);
      if (!resolvedComplaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      res.status(200).json({ message: 'Complaint resolved successfully', complaint: resolvedComplaint });
    } catch (error) {
      console.error('Error resolving complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ComplaintController;
