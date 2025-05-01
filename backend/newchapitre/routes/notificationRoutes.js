const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');


// Récupérer toutes les notifications
router.get('/notifications', notificationController.getNotifications);

// Marquer une notification comme lue
router.put('/:notificationId/read', notificationController.markAsRead);

// Marquer toutes les notifications comme lues
router.put('/read-all', notificationController.markAllAsRead);

// Récupérer le nombre de notifications non lues
router.get('/unread-count', notificationController.getUnreadCount);

// Supprimer une notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router; 