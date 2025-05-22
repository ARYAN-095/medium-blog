import {Hono, hono, HonoRequest} from 'hono';

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';

import {sign} from 'hono/jwt';
import { Bindings } from 'hono/types';
import { useReducer } from 'hono/jsx';
import { parseSigned } from 'hono/utils/cookie';


export  const userRouter= new Hono<{
 Bindings:{
    DATABASE_URL:string;
    JWT_SECRET: string;
 }
 }>();


 userRouter.post('/signup', async(c)=>{
    const body= await c.req.json();

    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

       const user= await prisma.user.create({
        data: {
            email: body.email,
            password: body.password
        }
       })

       const token  = await sign({id:user.id}, c.env.JWT_SECRET);

       return c.json({
        jwt:token
       })

       try{

       }catch(e){
        c.status(403);
        return c.json({error: "Invalid credientials"})
       }
 })





  userRouter.post('/signin', async(c)=>{
    const body= await c.req.json();


    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
       

    const user= await prisma.user.findUnique({
        where: {
            email:body.email,
            password: body.password
        }
    })

    if(!user){
        c.status(403);
         return c.json({error:"user not found"});
    }

    const token= await sign({id:user.id}, c.env.JWT_SECRET);
    return c.json({token});
  
    })