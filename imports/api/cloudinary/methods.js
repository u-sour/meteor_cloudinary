import { Meteor } from "meteor/meteor";
import cloudinary from "../../configs/cloudinary.config";

const folder = "Meteor Upload";
Meteor.methods({
  "cloudinary.upload": async ({ base64Files }) => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      folder: folder,
      use_filename: true,
      unique_filename: false,
    };
    try {
      const data = [];
      for (let index = 0; index < base64Files.length; index++) {
        const base64File = base64Files[index].base64;
        data.push(await cloudinary.uploader.upload(base64File, options));
      }
      return {
        status: 201,
        data: data,
        message: "Awesome, upload successfully.",
      };
    } catch (error) {
      throw new Meteor.Error(500, "Sorry, upload failed.");
    }
  },
  "cloudinary.find": async () => {
    const options = {
      type: "upload",
      prefix: folder,
    };
    try {
      const data = await cloudinary.api.resources(options);
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw Meteor.Error(error.error);
    }
  },
  "cloudinary.remove": async ({ publicId }) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      return {
        status: 202,
        message: "Awesome, remove successfully.",
      };
    } catch (error) {
      console.log(error);
      throw Meteor.Error(error.error);
    }
  },
});
