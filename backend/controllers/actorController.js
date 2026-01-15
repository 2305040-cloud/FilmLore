import { sql } from "../config/db.js";
export const getActorByID= async (req,res)=>
{
     const ActorID=Number(req.params.actorID)
    try{
       const actorQuery= await sql`
              SELECT * FROM "Actor" 
                WHERE "ActorID"=${ActorID}
        `;

        const actorMediaQuery= await sql`
                SELECT * FROM "Attributes"
                WHERE "AttributeID" IN (
                    SELECT "MediaID" FROM "MediaActor"
                    WHERE "ActorID"=${ActorID}
                )
        `;
        const actorAwardsQuery= await sql`
                SELECT * FROM "Award"
                WHERE "AwardID" IN (
                    SELECT "AwardID" FROM "ActorAward"
                    WHERE "ActorID"=${ActorID}
                )
        `;
   if(actorQuery.length===0)
   {
        return res.status(404).json({success:false,message:"Actor not found"})
   }
        const actorData=actorQuery[0];
        const mediaData=actorMediaQuery;
        const awardsData=actorAwardsQuery;
        actorData.awards=awardsData;
        actorData.media=mediaData;
                  
        
        console.log("Actor fetched" )
        res.status(200).json({success:true,data:actorData})
    }
    catch(error)
    {
          res.status(500).json({success:false,message:error.message} )
    }
}

export const getAllActors= async (req,res)=>
{
   
   try{
         const actorQuery= await sql`
              SELECT * FROM "Actor" 
                
        `;
        if(actorQuery.length===0  )
        {
            return res.status(404).json({success:false,message:"No actors found"})
        }
        console.log("Actors fetched" )
        res.status(200).json({success:true,data:actorQuery})
   }   
    catch(error)
    {
    console.log("error in getting actor",error)
    res.status(500).json({success:false,message:error.message} )
    }
}

export const getProduct= async (req,res)=>{
    const {id}=req.params;
    try{
        const product=await sql`
            SELECT * FROM products WHERE id=${id}`;
       
        console.log("Product fetched")
        res.status(200).json({success:true,data:product[0]})
        
    }
    catch(error)
    {
        console.log("error in fetching product",error)
        res.status(500).json({success:false,message:"Failed to fetch product"})
    }
    
}
export const updateProduct= async (req,res)=>{
    const {id}=req.params;
    const{name,price,image}=req.body
    try{
        const updatedProduct=await sql`
            UPDATE products 
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id}
            RETURNING *
        `
        console.log("Product updated")
        if(updateProduct.length===0)
        {
            return res.status(404).json({success:false,message:"Product not found"})
        }
        res.status(200).json({success:true,data:updatedProduct[0]})
}
catch(error){
    console.log("error in updating product",error)
    res.status(500).json({success:false,message:"Failed to update product"})

}
}
export const deleteProduct= async (req,res)=>{
   
    try{
        const deletedProduct=await sql`
            DELETE FROM products 
            WHERE id=${id}
            RETURNING *
        `
        console.log("Product deleted")
        if(deleteProduct.length===0)
        {
            return res.status(404).json({success:false,message:"Product not found"})
        }
        res.status(200).json({success:true,data:deletedProduct[0]}) 

    }
    catch(error){
        res.status(500).json({success:false,message:"Failed to delete product"})        
    }
}