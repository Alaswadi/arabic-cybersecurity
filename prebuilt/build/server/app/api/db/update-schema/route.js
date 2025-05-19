"use strict";(()=>{var e={};e.id=2980,e.ids=[2980],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},59796:e=>{e.exports=require("zlib")},33747:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>m,originalPathname:()=>h,requestAsyncStorage:()=>c,routeModule:()=>n,serverHooks:()=>d,staticGenerationAsyncStorage:()=>p,staticGenerationBailout:()=>l});var a={};t.r(a),t.d(a,{POST:()=>POST}),t(45851);var s=t(16379),i=t(83263),u=t(90935),o=t(50139);async function POST(e){try{let e=(0,o.e)(),{data:{session:r}}=await e.auth.getSession();if(!r)return u.Z.json({error:"Unauthorized"},{status:401});let{error:t}=await e.rpc("execute_sql",{sql_query:`
        DO $$
        BEGIN
          -- Check if the column already exists
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'services'
            AND column_name = 'image'
          ) THEN
            -- Add the column if it doesn't exist
            ALTER TABLE services ADD COLUMN image VARCHAR(255);
            
            -- Add comment
            COMMENT ON COLUMN services.image IS 'URL path to the service image';
          END IF;
        END
        $$;
      `});if(t)return console.error("Error updating schema:",t),u.Z.json({error:t.message},{status:500});return u.Z.json({success:!0,message:"Schema updated successfully"})}catch(e){return console.error("Error updating schema:",e),u.Z.json({error:e.message||"Failed to update schema"},{status:500})}}let n=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/db/update-schema/route",pathname:"/api/db/update-schema",filename:"route",bundlePath:"app/api/db/update-schema/route"},resolvedPagePath:"C:\\Users\\fadia\\Documents\\augment-projects\\arabic-cybersecurity\\app\\api\\db\\update-schema\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:d,headerHooks:m,staticGenerationBailout:l}=n,h="/api/db/update-schema/route"},50139:(e,r,t)=>{t.d(r,{e:()=>createClient});var a=t(77198);let createClient=()=>(0,a.createClient)("https://xahxjhzngahtcuekbpnj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E")},83263:(e,r)=>{var t;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(t||(t={}))}};var r=require("../../../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[7198,524],()=>__webpack_exec__(33747));module.exports=t})();