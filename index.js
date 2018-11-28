const { Base64 } = require('js-base64')
const request = require('request-promise')
const xlsx = require('xlsx')
require('dotenv').config()

const modulesToXlsx = (org, repo, file = 'package.json') => {
    let clientId = process.env.CLIENT_ID;
    let clientSecret = process.env.CLIENT_SECRET;

    let url = `https://api.github.com/repos/${org}/${repo}/contents/${file}?client_id=${clientId}&client_secret=${clientSecret}`

    request.get(url, {
        headers: {'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'}
    })
    .then(async res => {
    let jsonRes = JSON.parse(res)
    // console.log(jsonRes.content);
    
    let decoded = JSON.parse(Base64.decode(jsonRes.content))
    let modules = decoded.dependencies;
    console.log(modules);
    let xlsxData = [];
    let keys = Object.keys(modules)

    await keys.map(props => {
        let row = [props, modules[props]]
        xlsxData.push(row)
    })

    return xlsxData
    
})
.then(data => {
    let wb = xlsx.utils.book_new()
    wb.Props = {
        Title: "orel-sarit",
        Subject: "new date",
        Author: "sarit and orel were here",
        CreatedDate: new Date()
    }

    wb.SheetNames.push(repo)
    let ws = xlsx.utils.aoa_to_sheet(data)
    wb.Sheets[repo] = ws

        console.log({data});

        // xlsx.stream.to_csv()
        xlsx.writeFile(wb,`${org}_modules.xlsx`)
    
})
}

modulesToXlsx('actomatics','easyrecipe')