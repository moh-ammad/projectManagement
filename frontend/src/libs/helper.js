// src/libs/helper.js
import { toast } from "react-toastify";

export function showSuccess(msg) {
  toast.success(msg);
}

export function showError(msg) {
  toast.error(msg);
}
