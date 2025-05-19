"use strict";(()=>{var e={};e.id=1518,e.ids=[1518],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},59796:e=>{e.exports=require("zlib")},27961:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>d,originalPathname:()=>g,requestAsyncStorage:()=>c,routeModule:()=>n,serverHooks:()=>p,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>h});var s={};r.r(s),r.d(s,{GET:()=>GET,POST:()=>POST}),r(45851);var o=r(16379),a=r(83263),i=r(50139),u=r(90935);async function GET(){try{let e=(0,i.e)(),{data:t,error:r}=await e.rpc("get_policies");if(r)return u.Z.json({error:r.message},{status:500});return u.Z.json({policies:t})}catch(e){return console.error("Error getting policies:",e),u.Z.json({error:"Internal server error"},{status:500})}}async function POST(){try{let e=(0,i.e)(),{error:t}=await e.storage.from("images").upload("test.txt",new Blob(["test"]),{upsert:!0});if(t)return console.error("Error uploading test file:",t),u.Z.json({error:t.message,details:`
          To fix this issue, please run the following SQL in the Supabase SQL Editor:

          -- Allow public access to the images bucket
          CREATE POLICY "Public Access" ON storage.objects
            FOR SELECT
            USING (bucket_id = 'images');

          -- Allow authenticated users to upload files to the images bucket
          CREATE POLICY "Authenticated users can upload" ON storage.objects
            FOR INSERT
            WITH CHECK (
              bucket_id = 'images' AND
              auth.role() = 'authenticated'
            );

          -- Allow authenticated users to update their own files
          CREATE POLICY "Authenticated users can update their own files" ON storage.objects
            FOR UPDATE
            USING (
              bucket_id = 'images' AND
              auth.uid() = owner
            );

          -- Allow authenticated users to delete their own files
          CREATE POLICY "Authenticated users can delete their own files" ON storage.objects
            FOR DELETE
            USING (
              bucket_id = 'images' AND
              auth.uid() = owner
            );
        `},{status:500});let{error:r}=await e.storage.from("images").remove(["test.txt"]);return r&&console.warn("Could not delete test file:",r),u.Z.json({success:!0})}catch(e){return console.error("Error updating storage policy:",e),u.Z.json({error:"Internal server error"},{status:500})}}let n=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/storage-policy/route",pathname:"/api/storage-policy",filename:"route",bundlePath:"app/api/storage-policy/route"},resolvedPagePath:"C:\\Users\\fadia\\Documents\\augment-projects\\arabic-cybersecurity\\app\\api\\storage-policy\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:p,headerHooks:d,staticGenerationBailout:h}=n,g="/api/storage-policy/route"},50139:(e,t,r)=>{r.d(t,{e:()=>createClient});var s=r(77198);let createClient=()=>(0,s.createClient)("https://xahxjhzngahtcuekbpnj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E")},83263:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[7198,524],()=>__webpack_exec__(27961));module.exports=r})();