"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const request_validator_middleware_1 = require("../../middlewares/request-validator.middleware");
const roomController = __importStar(require("./room.controller"));
const router = express_1.default.Router();
// POST /api/v1/rooms
router.post('/', [
    (0, express_validator_1.body)('room_number').trim().notEmpty().isString(),
    (0, express_validator_1.body)('floor').trim().notEmpty().isInt(),
    (0, express_validator_1.body)('room_type').trim().notEmpty().isString(),
    (0, express_validator_1.body)('capacity').trim().notEmpty().isInt(),
    (0, express_validator_1.body)('area_sqm').trim().notEmpty().isInt(),
    (0, express_validator_1.body)('chair_count').trim().notEmpty().isInt(),
    (0, express_validator_1.body)('window_count').trim().notEmpty().isInt(),
    (0, express_validator_1.body)('has_natural_light').trim().notEmpty().isBoolean(),
    (0, express_validator_1.body)('has_projector').trim().notEmpty().isBoolean(),
    (0, express_validator_1.body)('has_microphone').trim().notEmpty().isBoolean(),
    (0, express_validator_1.body)('has_camera').trim().notEmpty().isBoolean(),
    (0, express_validator_1.body)('has_air_conditioner').trim().notEmpty().isBoolean(),
    (0, express_validator_1.body)('has_noise_cancelling').trim().notEmpty().isBoolean(),
], request_validator_middleware_1.validateRequest, roomController.createRoom);
exports.default = router;
