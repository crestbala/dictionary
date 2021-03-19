const express = require('express');
const spellChecker = require('hunspell-spellchecker');
const fs = require('fs');
const url = require('url');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/dictionary", (req, res) => {
  const queryText = url.parse(req.url, true).query.q;
  const checker = new spellChecker();
  let DICT = checker.parse({
    aff: fs.readFileSync("./index.aff"),
    dic: fs.readFileSync("./index.dic")
  });
  checker.use(DICT)
  const suggestionsData = checker.suggest(queryText) 
  const isValid = String(checker.check(queryText));
  if(suggestionsData.length == 0) {
    return res.json({
      msg: "There is no suggestion for this query"
    })
  }else {
    return res.json({
      suggestions: suggestionsData,
      isRight: isValid
    })
  } 

})

app.listen(8080);