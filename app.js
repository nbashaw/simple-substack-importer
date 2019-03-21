require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { createHash } = require('crypto');
const rp = require('request-promise-native');
const substack_key = process.env.SUBSTACK_IMPORT_KEY;
const subdomain = process.env.SUBSTACK_SUBDOMAIN;
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/import', async (req, res) => {
    if (!req.query.email) throw new Error('Need a query param with the email');
    await postEmailToSubstack(req.body.email);
    res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Simple Substack Importer listening on port ${port}!`);
});

const postEmailToSubstack = async (email) => {

    // Generate hash combining your API key and the email
    const hash = createHash('sha256').update(substack_key + email).digest('base64');
    
    // Set up the request
    const reqOptions = {
      url: `https://${subdomain}.substack.com/api/v1/import/external`,
      method: 'POST',
      headers: { 'Authorization': `SHA256 ${hash}` },
      form: { email }
    };
    
    await rp(reqOptions);
  };