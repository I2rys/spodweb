"use strict";

// Dependencies
const request = require("request-async")
const { JSDOM } = require("jsdom")
const fs = require("fs")

// Variables
const args = process.argv.slice(2)
const vL = new Set()
const fE = new Set()

// Functions
async function start(url){
    if(vL.has(url)) return
    vL.add(url)
  
    try{
        const response = await request(url)
        const dom = new JSDOM(response.body)
        const pE = response.body.match(/\b[\w\.\-_]+@[a-zA-Z0-9.-]+\.\w+\b/ig)
        const links = []

        pE.forEach((email)=>{
            if(!fE.has(email)){
                fE.add(email)
                console.log(email)
            }
        })

        dom.window.document.querySelectorAll('a').forEach((elem)=>links.push(`${args[0]}${elem.getAttribute("href")}`))

        for( const l of links ){
            const pU = new URL(l)
            const bD = new URL(args[0]).hostname
            if(pU.hostname.endsWith(bD)) await start(l)
        }
    }catch{
        console.log(`Unable to scrape ${url}`)
    }
}

// Main
if(!args.length) return console.log("usage: node index.js <url> <outputFile>")

console.log("Scraping the website for emails, please wait...")
start(args[0]).then(()=>{
    fs.writeFileSync(args[2], Array.from(fE).split("\n"), "utf8")
    console.log("Finished.")
})