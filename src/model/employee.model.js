import mongoose from "mongoose";
import { Entry } from "./entry.model.js";
import { Account } from "../accounts/account.model.js";

export const employee_scheema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,   
        required: true,
        index: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,   
        required: true,
        index: true,
    }
});

export const Employee = mongoose.model("Employee", employee_scheema);