import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';

import {sign} from 'hono/jwt';

export const blogRouter= new Hono<{
    Bindings:{
        DATABASE_URL: string, 
        JWT_SECRET: string,
    }
}>()

blogRouter.post('/', async(c)=>{
    const body =c.req.json();

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


 blogRouter.put('/api/v1/blog', async(c)=>{
    
 })