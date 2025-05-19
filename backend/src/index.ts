import { Hono } from 'hono'

const app = new Hono()

 app.post('api/v1/signup',  (c)=>{
        return c.text("Hello world")
 });

 app.post('api/v1/login', (c)=>{
        return c.text("Hello world")
 });

 app.post('api/v1/blog', (c)=>{
        return c.text("Hello world")
 });

 app.put('api/v1/blog', (c)=>{
        return c.text("Hello world")
 });

 app.get('api/v1/blog',(c)=>{
        return c.text("Hello world")
 });

export default app
 