const Joi = require("joi");

const requestOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("lawyer", "client", "admin").default("lawyer"),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const lawyerProfileSchema = Joi.object({
  full_name: Joi.string().required(),
  bar_registration_number: Joi.string().required(),
  specialization: Joi.array().items(Joi.string()),
  court_practice: Joi.array().items(Joi.string()),
  fee_structure: Joi.object({
    consultation: Joi.number(),
    court: Joi.number(),
  }),
  years_experience: Joi.number().integer(),
  languages: Joi.array().items(Joi.string()),
  city: Joi.string(),
  consultation_type: Joi.string().valid("online", "offline", "both"),
  state: Joi.string(),
  secondary_specialization: Joi.array().items(Joi.string()),
});

const lawyerFileUploadSchema = Joi.object({
  full_name: Joi.string().optional(),
  bar_registration_number: Joi.string().optional(),
  specialization: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  court_practice: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  fee_structure: Joi.alternatives().try(
    Joi.object({
      consultation: Joi.number(),
      court: Joi.number(),
    }),
    Joi.string()
  ).optional(),
  years_experience: Joi.alternatives().try(
    Joi.number().integer(),
    Joi.string().pattern(/^\d+$/)
  ).optional(),
  languages: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  city: Joi.string().optional(),
  consultation_type: Joi.string().valid("online", "offline", "both").optional(),
  state: Joi.string().optional(),
  secondary_specialization: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  message: Joi.string().optional(),
}).unknown(true); // Allow unknown fields (for files)

const respondAppointmentSchema = Joi.object({
  appointmentId: Joi.string().uuid().required(),
  status: Joi.string()
    .valid("accepted", "rejected", "completed", "cancelled")
    .required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const clientProfileSchema = Joi.object({
  full_name: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/),
  date_of_birth: Joi.date().iso(),
  occupation: Joi.string(),
  emergency_contact: Joi.string().pattern(/^[0-9+\-\s()]+$/),
  preferred_communication: Joi.string().valid("email", "phone", "both"),
  preferred_consultation_type: Joi.string().valid("online", "offline", "both"),
  legal_history: Joi.string().allow(""),
});

const bookAppointmentSchema = Joi.object({
  lawyer_id: Joi.string().uuid().required(),
  consultation_type: Joi.string().valid("online", "offline").required(),
  scheduled_time: Joi.date().iso().greater("now").required(),
  case_description: Joi.string().max(1000).allow("").optional(),
});

const reviewSchema = Joi.object({
  lawyer_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  review_text: Joi.string().max(500),
});

const lawyerSearchSchema = Joi.object({
  specialization: Joi.string(),
  min_fee: Joi.number().integer().min(0),
  max_fee: Joi.number().integer().min(0),
  language: Joi.string(),
  city: Joi.string(),
  min_rating: Joi.number().min(1).max(5),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

module.exports = {
  requestOtpSchema,
  verifyOtpSchema,
  lawyerProfileSchema,
  lawyerFileUploadSchema,
  respondAppointmentSchema,
  refreshTokenSchema,
  clientProfileSchema,
  bookAppointmentSchema,
  reviewSchema,
  lawyerSearchSchema,
};
