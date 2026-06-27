import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


export const createCourse = async (req, res) => {


    const adminId = req.adminId
    const { title, description, price } = req.body;


    try {
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "All field are required" })
        }

        const { image } = req.files
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "No File Uploaded" });
        }

        const allowedFormat = ["image/png", "image/jpeg"]

        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ error: "Invalid file Format .Only jpeg And Png are Allowed" });
        }

        //     //Cloudinary code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ errors: "Error Uploading File To cloudionary" });
        }

        const courseData = {
            title,
            description,
            price,
            image
                : {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
            creatorId: adminId

        }

        const course = await Course.create(courseData)
        res.json({
            message: "Course Created Successfully",
            course
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error Creating Course" });

    }
}


export const updateCourse = async (req, res) => {

    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    try {
        const course = await Course.findOne({ _id: courseId, creatorId: adminId });

        if (!course) {
            return res.status(404).json({ errors: "Can't update, created by other Admin" });
        }

        // If there's a new image file
        if (req.file) {
            // Delete old image if needed
            if (course.image?.public_id) {
                await cloudinary.v2.uploader.destroy(course.image.public_id);
            }

            // Upload new image to Cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'courses',
            });

            course.image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        }

        // Update text fields
        course.title = title;
        course.description = description;
        course.price = price;

        await course.save();

        res.status(200).json({ message: "Course Updated Successfully", course });
    } catch (error) {
        console.error("Error in Course Updating", error);
        res.status(500).json({ errors: "Error in Course Updating" });
    }

    // const adminId=req.adminId
    // const {courseId}=req.params;
    // const {title,description,price,image} = req.body;


    // try {
    //     const course = await Course.findOneAndUpdate({
    //         _id:courseId,
    //         creatorId:adminId,

    //     },{
    //         title,
    //         description,
    //         price,
    //         image:{
    //             public_id:image?.public_id,
    //             url:image?.url,
    //         }
    //     }
    // );

    // if(!course){
    //     return res.status(404).json({errors:"can't update, created by other Admin"})
    // }
    // res.status(201).json({message:"Course Updated Successfully",course});

    // } catch (error) {
    //     res.status(500).json({errors:"Error in Course Updating"});
    //     console.log("Error in Course Updating",error);
    // }
}


export const deleteCourse = async (req, res) => {

    const adminId = req.adminId
    const { courseId } = req.params;

    try {

        // const courseSearch = await Course.findById(courseId);
        // if(!courseSearch){
        //     return res.status(404).json({errors:"Course not Found"});
        // }
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,

        })
        if (!course) {
            return res.status(404).json({ errors: "cannot delet ,created by other admin" })
        }
        res.status(200).json({
            message: "Course Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({ errors: "Error in Course Deleting" })
        console.log("Error in Course Deleting", error);
    }
}


export const getCourses = async (req, res) => {

    try {
        const courses = await Course.find({})
        res.status(201).json({ courses })

    } catch (error) {
        res.status(500).json({ errors: "Error in Getting Courses " })

        console.log("Error to Get Courses", error);
    }

}

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;

    try {

        const course = await Course.findById(
            courseId
        );

        if (!course) {
            return res.status(404).json({ error: "Course Not Found" })
        }
        res.status(200).json({
            course
        })


    } catch (error) {
        res.status(500).json({ errors: "Error in Getting Course Details " })

        console.log("Error to Get Course", error);
    }
}

export const buyCourses = async (req, res) => {

    const { userId } = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId)
        console.log(course)
        if (!course) {
            return res.status(404).json({ errors: "Course Not Found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, courseId })

        if (existingPurchase) {
            return res.status(400).json({ errors: "User Has Already Purchase This Course" });

        }


        // Stripe Payment Code 


        const newPurchase = new Purchase({ userId, courseId })
        await newPurchase.save()
        res.status(201).json({ message: "Course Purchased Successfully", newPurchase })

    } catch (error) {
        res.status(500).json({ errors: "Error in Course Buying" });
        console.log("Error in Course Buying", error)
    }

}
