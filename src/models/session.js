import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Приєднання до моделі User для можливих зв'язків
    },
    accessToken: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true, 
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Індекси для оптимізації пошуку
sessionSchema.index({ userId: 1 });
sessionSchema.index({ accessToken: 1 }, { unique: true });
sessionSchema.index({ refreshToken: 1 }, { unique: true });
sessionSchema.index({ refreshTokenValidUntil: 1 }, { expireAfterSeconds: 0 }); // TTL для видалення застарілих сесій

const Session = mongoose.model('Session', sessionSchema);

export { Session };
