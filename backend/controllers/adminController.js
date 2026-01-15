import { sql } from "../config/db.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const handleAdminEntry = async (req, res) => {
  const reqData = req.body;
  console.log("Admin entry data:", reqData);

  if (!reqData || !reqData.dataType) {
    return res.status(400).json({ success: false, message: "dataType missing" });
  }

  try {
    switch (reqData.dataType) {
      case "genre": {
        const genreValues = reqData.data || [];
        const results = await Promise.all(
          genreValues.map(async (genre) => {
            try {
              await sql`
                INSERT INTO "Genre" ("GenreName")
                VALUES (${genre})
                
              `;
              return { success: true, value: genre };
            } catch (e) {
              return { success: false, value: genre, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some genres could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All genres added successfully", results });
      }

      case "studio": {
        const studioValues = reqData.data || [];
        const results = await Promise.all(
          studioValues.map(async (studio) => {
            try {
              await sql`
                INSERT INTO "Studio" ("StudioName","FoundingYear","Location")
                VALUES (${studio.StudioName}, ${studio.FoundingYear}, ${studio.Location})
                
              `;
              return { success: true, value: studio.StudioName };
            } catch (e) {
              return { success: false, value: studio.StudioName, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some studios could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All studios added successfully", results });
      }

      case "actor": {
        const actorValues = reqData.data || [];
        const results = await Promise.all(
          actorValues.map(async (actor) => {
            try {
              await sql`
                INSERT INTO "Actor" ("ActorName","Biography","Nationality","DOB")
                VALUES (${actor.ActorName}, ${actor.Biography}, ${actor.Nationality}, ${actor.DOB})
                ON CONFLICT ("ActorName") DO NOTHING
              `;
              return { success: true, value: actor.ActorName };
            } catch (e) {
              return { success: false, value: actor.ActorName, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some actors could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All actors added successfully", results });
      }

      case "director": {
        const directorValues = reqData.data || [];
        const results = await Promise.all(
          directorValues.map(async (director) => {
            try {
              await sql`
                INSERT INTO "Director" ("DirectorName","Biography","Nationality","DOB")
                VALUES (${director.DirectorName}, ${director.Biography}, ${director.Nationality}, ${director.DOB})
                ON CONFLICT ("DirectorName") DO NOTHING
              `;
              return { success: true, value: director.DirectorName };
            } catch (e) {
              return { success: false, value: director.DirectorName, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some directors could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All directors added successfully", results });
      }

      case "media": {
        const mediaValues = reqData.data || [];
        const results = await Promise.all(
          mediaValues.map(async (media) => {
            try {
              await sql`
                INSERT INTO "Media" ("Title","ReleaseYear","OverView","Language","Trailer")
                VALUES (${media.Title}, ${media.ReleaseYear}, ${media.OverView}, ${media.Language}, ${media.Trailer})
                ON CONFLICT ("Title") DO NOTHING
              `;
              return { success: true, value: media.Title };
            } catch (e) {
              return { success: false, value: media.Title, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some media could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All media added successfully", results });
      }

      case "mediaactor": {
        const mediaActorValues = reqData.data || [];
        const results = await Promise.all(
          mediaActorValues.map(async (value) => {
            try {
              // Insert using SELECT (correct way)
              await sql`
                INSERT INTO "MediaActor" ("MediaID","ActorID")
                SELECT m."MediaID", a."ActorID"
                FROM "Media" m
                JOIN "Actor" a ON a."ActorName" = ${value.Actor}
                WHERE m."Title" = ${value.Media}
                ON CONFLICT ("MediaID","ActorID") DO NOTHING
              `;
              return { success: true, value };
            } catch (e) {
              return { success: false, value, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some media-actor links could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All media-actor links added successfully", results });
      }

      case "mediadirector": {
        const mediaDirectorValues = reqData.data || [];
        const results = await Promise.all(
          mediaDirectorValues.map(async (value) => {
            try {
              await sql`
                INSERT INTO "MediaDirector" ("MediaID","DirectorID")
                SELECT m."MediaID", d."DirectorID"
                FROM "Media" m
                JOIN "Director" d ON d."DirectorName" = ${value.Director}
                WHERE m."Title" = ${value.Media}
                
              `;
              return { success: true, value };
            } catch (e) {
              return { success: false, value, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some media-director links could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All media-director links added successfully", results });
      }

      case "mediastudio": {
        const mediaStudioValues = reqData.data || [];
        const results = await Promise.all(
          mediaStudioValues.map(async (value) => {
            try {
              await sql`
                INSERT INTO "MediaStudio" ("MediaID","StudioID")
                SELECT m."MediaID", s."StudioID"
                FROM "Media" m
                JOIN "Studio" s ON s."StudioName" = ${value.Studio}
                WHERE m."Title" = ${value.Media}
                ON CONFLICT ("MediaID","StudioID") DO NOTHING
              `;
              return { success: true, value };
            } catch (e) {
              return { success: false, value, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some media-studio links could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All media-studio links added successfully", results });
      }

      case "mediagenre": {
        const mediaGenreValues = reqData.data || [];
        const results = await Promise.all(
          mediaGenreValues.map(async (value) => {
            try {
              await sql`
                INSERT INTO "MediaGenre" ("MediaID","GenreID")
                SELECT m."MediaID", g."GenreID"
                FROM "Media" m
                JOIN "Genre" g ON g."GenreName" = ${value.Genre}
                WHERE m."Title" = ${value.Media}
                ON CONFLICT ("MediaID","GenreID") DO NOTHING
              `;
              return { success: true, value };
            } catch (e) {
              return { success: false, value, message: e.message };
            }
          })
        );

        const failures = results.filter((r) => !r.success);
        if (failures.length) {
          return res.status(207).json({
            message: "Some media-genre links could not be inserted",
            success: results.filter((r) => r.success),
            failures,
          });
        }
        return res.status(200).json({ message: "All media-genre links added successfully", results });
      }

      default:
        return res.status(400).json({ success: false, message: "invalid dataType" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




export const getAdminStats = async (req, res) => {
  try {
    const statQuery = await sql`
      SELECT
        (SELECT COUNT(*) FROM "Actor")       AS "actorCount",
        (SELECT COUNT(*) FROM "Director")    AS "directorCount",
        (SELECT COUNT(*) FROM "Studio")      AS "studioCount",
        (SELECT COUNT(*) FROM "Attributes")  AS "mediaCount",
        (SELECT COUNT(*) FROM "Movie")       AS "movieCount",
        (SELECT COUNT(*) FROM "Series")      AS "seriesCount";
    `;

    return res.status(200).json(statQuery[0]);
  } catch (error) {
    return res.status(400).json({
      message: "error finding stats",
    });
  }
};


export const sendEmail=async(req,res)=>
{
 const {users,message,subject}=req.body;
   try{
       
       const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:
        {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
       })

     const  results=await Promise.all(users.map(async (user)=>
    {
        const Body=`Dear ${user.username},\n\n${message}\n\nRegards,\nFilmLore Admin`;
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:user.email,
            subject:subject,
            text:Body

        };
        return transporter.sendMail(mailOptions)
    }))
     return res.status(200).json(
        {
            success:true,
            message:"all mail sent succesfully",
            details:results.length
        }
    )
   }
   catch(error)
   {
   return res.status(400).json({
    message:"not sent"
   })

   }
}



export const getUserLocationInfo=async(req,res)=>
{
  try{

  }
  catch(error)
  {

  }
}





