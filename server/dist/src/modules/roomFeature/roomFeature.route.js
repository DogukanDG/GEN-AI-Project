"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomFeature_controller_1 = require("./roomFeature.controller");
const authorize_user_middleware_1 = require("../../middlewares/authorize-user.middleware");
const role_authorization_middleware_1 = require("../../middlewares/role-authorization.middleware");
const request_validator_middleware_1 = require("../../middlewares/request-validator.middleware");
const roomFeature_validation_1 = require("./roomFeature.validation");
const router = (0, express_1.Router)();
const roomFeatureController = new roomFeature_controller_1.RoomFeatureController();
// Create a new room feature (Admin only)
router.post('/', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.requireAdmin, roomFeature_validation_1.createRoomFeatureValidation, request_validator_middleware_1.validateRequest, roomFeatureController.createRoomFeature);
// Get all room features for current user (Protected)
router.get('/my-room-features', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.setUserRole, roomFeatureController.getUserRoomFeatures);
// Get all room features (Protected - all authenticated users can view)
router.get('/all', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.setUserRole, roomFeatureController.getAllRoomFeatures);
// Get room feature by ID (Protected - all authenticated users can view)
router.get('/:id', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.setUserRole, roomFeature_validation_1.getRoomFeatureValidation, request_validator_middleware_1.validateRequest, roomFeatureController.getRoomFeatureById);
// Update room feature (Admin only)
router.put('/:id', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.requireAdmin, roomFeature_validation_1.updateRoomFeatureValidation, request_validator_middleware_1.validateRequest, roomFeatureController.updateRoomFeature);
// Delete room feature (Admin only)
router.delete('/:id', authorize_user_middleware_1.authorizeUser, role_authorization_middleware_1.requireAdmin, roomFeature_validation_1.deleteRoomFeatureValidation, request_validator_middleware_1.validateRequest, roomFeatureController.deleteRoomFeature);
exports.default = router;
