import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, sparse: true },
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, required: true },

    // refresh token rotation/support (simple)
    refreshToken: { type: String, default: null },

    // forgot/reset
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);
savedReels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel", default: [] }],
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();

});

UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};
//hide sensitive fields in json
UserSchema.method.toJSON = function() {
const obj = this.toObject();
delete obj.password;
delete obj.refreshToken;
delete obj.resetToken;
delete obj.resetTokenExpiresAt;
return obj;
};

export default mongoose.model("User", UserSchema);