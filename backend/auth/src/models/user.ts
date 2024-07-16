import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

// An interface that describes the properties/attributes
// that are required to create a new User to work with ts
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties/attributes that
// a User Model (entire collection of user) has adding this
// because without this we cannot use User.build() directly
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Issue 2 with TS + mongoose
// const user = new User({email:'', password: ''})
// console.log(user); ----> {email:'',password: '', createdAt: '', updatedAt: ''}
// The properties that we pass to the User constructor don't necessatily match up
// with the properties available on a user to solve this create another interface

// An interface that describes the properties/attributes that a User Document or
// a single user has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Create a user schema => to tell mongoose all different properties our user will have
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // Overriding the JSON.stringify
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// To hash the password
userSchema.pre("save", async function (done) {
  // Hash only if password is modified
  if (this.isModified("password")) {
    const hasedPassword = await PasswordManager.toHash(this.get("password"));
    this.set("password", hasedPassword);
  }
  done();
});

// The below method (buildUser) works just fine but we need to export it
// and remember to call it when creating a new user so a more better way
// would be adding a helper method to user model itself then we can call
// it more easily and more intuitively by User.build()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create a user model to interact with db
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// TS and mongoose do not work well together so adding
// a function to build user for type checking instead of
// directly doing new User({})
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs)
// }

// ----------------- No type checking -----------------
// new User ({
//     email: 'test@test.co',
//     pass: 'test123',
//     anyOtherAttribute: 'fjolfhn'
// })

// ----------------- With type checking -----------------
// buildUser({
//     email: 'test@test.co',
//     pass: 'test123', // TS throws error
// })

// export { User, buildUser};

export { User };
