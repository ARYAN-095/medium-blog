import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { makeAccelerateExtension, withAccelerate } from '@prisma/extension-accelerate';

import {sign, verify} from 'hono/jwt';
import app from "..";

export const blogRouter= new Hono<{
    Bindings:{
        DATABASE_URL: string, 
        JWT_SECRET: string,
    },
    Variables:{
        userId:string
    }
}>()


blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    try {
        const user = await verify(token, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            return c.json({ message: "You are not logged in" }, 403);
        }
    } catch (e) {
        return c.json({ message: "Invalid or expired token" }, 403);
    }
});




blogRouter.post('/', async(c)=>{

    const userId= c.get('userId');

    const body =await c.req.json();

    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const post= await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: userId
        }
    })

    return c.json({
        id:post.id
    })
})


 blogRouter.put('/', async(c)=>{
    

    const userId= c.get('userId');
    const prisma= new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());


       const body= await c.req.json();
      try {
        await prisma.post.update({
            where: {
                id: body.id,
                authorId: userId
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
        return c.text('updated post');
    } catch (e) {
        return c.json({ error: 'Could not update post' }, 400);
    }
 })



 // i have to do pagination for this

  blogRouter.get('/bulk', async(c)=>{

    const prisma= new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

     const posts = await prisma.post.findMany();
    return c.json(posts);

 })


 

 blogRouter.get('/:id',async(c)=>{
    const id= c.req.param('id');
    const prisma= new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    const post= await prisma.post.findUnique({
        where:{
            id
        }
    })

    return c.json(post);
 })



 

