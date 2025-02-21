const http=require('http')
const app=require("./app")
const port=process.env.PORT||4000;
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");

app.use(connectLiveReload());



const server=http.createServer(app);


server.listen(3000,()=>{
    console.log(`Server is running on port${port}`)
});