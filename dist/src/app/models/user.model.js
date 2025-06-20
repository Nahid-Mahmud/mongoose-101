"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// In your user.model.ts file
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const user_interface_1 = require("../interface/user.interface");
const notes_model_1 = __importDefault(require("./notes.model"));
const addressSchema = new mongoose_1.Schema({
    street: { type: String },
    city: { type: String },
    zipCode: { type: Number },
}, {
    _id: false,
    timestamps: true,
});
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already exists with another user!"],
        trim: true,
        lowercase: true,
        // match: [/.+\@.+\..+/, "Enter a valid Email. You have entered {VALUE}"],
        // validate: {
        //   validator: function (v: string) {
        //     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        //   },
        //   message: (props: { value: string }) => `${props.value} is not a valid email!`,
        // },
        validate: [validator_1.default.isEmail, "Your email '{VALUE}' is not valid!"],
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: Object.values(user_interface_1.UserRole),
            message: "Role must be one of the following: " + Object.values(user_interface_1.UserRole).join(", "),
        },
        default: user_interface_1.UserRole.USER,
        uppercase: true,
        trim: true,
    },
    age: { type: Number, required: true, min: [18, "Must be at least 18, got {VALUE}"], max: 100 },
    address: { type: addressSchema },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.method("hashPassword", function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = yield bcryptjs_1.default.hash(plainPassword, 10);
        return password;
    });
});
userSchema.static("hashPassword", function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = yield bcryptjs_1.default.hash(plainPassword, 10);
        return password;
    });
});
// hook
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        // console.log(this);
    });
});
userSchema.post("save", function (doc) {
    console.log("User created successfully:", doc);
});
userSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield notes_model_1.default.deleteMany({ user: doc._id });
        }
        // console.log("User deleted successfully:", doc);
    });
});
userSchema.pre("find", function (next) {
    this.select("-password");
    // console the document being queried);
    // console.log("Querying users without password field");
    next();
});
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.User = (0, mongoose_1.model)("User", userSchema);
