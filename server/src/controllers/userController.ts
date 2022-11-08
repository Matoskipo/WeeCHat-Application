import { Request, Response } from "express";
import path from "path";
import formidable from "formidable";
import validator from "validator";
import user from "../models/user";
import { generateLoginToken, options } from "../utils/utils";
import fs from "fs";
import bcrypt from "bcrypt";

export const userRegister = (req: Request, res: Response) => {
  const form = formidable();

  form.parse(req, async (err, fields, files: any) => {
    const { userName, email, password, confirmPassword } = fields;
    const { image } = files;
    const error = [];

    if (!userName) {
      error.push("please provide a user name");
    }
    if (!email) {
      error.push("please provide an email");
    }
    if (email && !validator.isEmail(email as string)) {
      error.push("please provide your valid email");
    }
    if (!password) {
      error.push("please provide your password");
    }
    if (!confirmPassword) {
      error.push("please provide a  password");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push("please provide a match password");
    }
    if (password && password.length < 6) {
      error.push("passsword character must not be less than 6");
    }
    if (Object.keys(files).length === 0) {
      error.push("please provide an image");
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const getImageName = files.image.originalFilename;
      const randomNumber = Math.floor(Math.random() * 99999);
      const newImageName = randomNumber + getImageName;
      files.image.originalFilename = newImageName;
      const newPath = path.join(
        __dirname,
        "../../../frontend/public/image/" + `${files.image.originalFilename}`
      );

      try {
        const checkUser = await user.findOne({ email: email });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Email already exist"],
            },
          });
        } else {
          fs.copyFile(files.image.filepath, newPath, async (error) => {
            if (!error) {
              const hashPassword = await bcrypt.hash(password as any, 10);
              const userCreate = await user.create({
                userName,
                email,
                password: hashPassword,
                image: files.image.originalFilename,
              });
              const token = generateLoginToken({
                              id : userCreate._id,
                              email: userCreate.email,
                              userName: userCreate.userName,
                              image: userCreate.image,
                              // registerTime : userCreate?.createdAt
              });

              res.status(201).cookie("userToken", token, options).json({
                successMessage: "Your registration was successful",
                token,
              });
            } else {
              res.status(500).json({
                error: {
                  errorMessage: ["internal server error"],
                },
              });
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ["internal server error"],
          },
        });
      }
    }
  });
  //  end of formidable
};

export const userLogin =async (req:Request, res:Response)=>{
  const error = []
  const {email, password} = req.body
  if (!email) {
      error.push("please provide an email");
    }
  if (!password) {
      error.push("please provide your password");
    }
  if(email && !validator.isEmail(email)){
    error.push('please provide your valid email')
  }
  if(error.length > 0){
    res.status(400).json({
      error:{
        errorMessage:error
      }
    })
  }
  else{
    try {
      const checkUser = await user.findOne({
        email:email
      }).select('+password')
      if(checkUser){
        const comparePassword = await bcrypt.compare(password,checkUser.password)
        if(comparePassword){
           const token = generateLoginToken({
                              id : checkUser._id,
                              email: checkUser.email,
                              userName: checkUser.userName,
                              image: checkUser.image,
                              // registerTime : userCreate?.createdAt
              })
               res.status(200).cookie("userToken", token, options).json({
                successMessage: "Your login was successful",
                token,
              });
        }
       else{
        res.status(400).json({
          error:{
            errorMessage: ['Invalid password']
          }
        })
       }

      }
      else{
        res.status(400).json({
          error:{
            errorMessage: ['Invalid email']
          }
        })
      }
    } catch (error) {
      res.status(400).json({
          error:{
            errorMessage: ['Internal server error']
          }
        })
    }
  }
}
