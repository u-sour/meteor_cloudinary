import { Meteor } from "meteor/meteor";
import { v2 as cloudinary } from "cloudinary";

const { cloud_name, api_key } = Meteor.settings.public;
const { api_secret } = Meteor.settings.cloudinary;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
  secure: true,
});

export default cloudinary;
