import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      default: "personal",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Індекси для покращення продуктивності запитів
contactSchema.index({ userId: 1 });
contactSchema.index({ name: 1 }); // Додано індекс на ім'я для прискорення пошуку, якщо це потрібно

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
