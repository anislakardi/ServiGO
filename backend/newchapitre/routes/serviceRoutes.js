const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/ServiceController");

// grt services
router.get("/demande/services", ServiceController.getAllServices);
router.get("/demande/services/:id", ServiceController.getServicesById);
router.get("/demande/services/users/:id", ServiceController.getServicesByIdUsers);
router.get("/demande/prestataires/client/:id", ServiceController.getPrestatairesByClient);

// Route pour les revenus estimés
router.get("/services/revenue/:prestataireId", ServiceController.getEstimatedRevenue);

//get request
router.get("/demande/requests", ServiceController.getAllRequests);
router.get("/demande/requests/:id", ServiceController.getRequestsById);
router.get("/demande/requests/users/:id", ServiceController.getRequestsByIdUsers);

// post request
router.post("/demande/services", ServiceController.createServiceRequest);

// accepte ou refuse
router.put("/demande/services/decision/:id", ServiceController.approveOrRejectRequest);

//modifier
router.post("/demande/services/modification", ServiceController.createModificationRequest);

// supprimer un request
router.delete("/demande/services/:id", ServiceController.deletePendingRequest);
router.delete("/demande/servicesExist/:id", ServiceController.deleteService);

module.exports = router;