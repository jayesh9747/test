const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: 'http://localhost:9200/',
    auth: {
        apiKey: `${process.env.ELASTICSEARCH_API}`
    },
    ssl: { rejectUnauthorized: false }
});

const express = require('express');
const router = express.Router();



const get = async (req, res) => {
    const resp = await client.info();
    console.log(resp);
    res.json({
        msg: 'connected to ElasticSearch',
        search: resp
    })
}

const addDocument = async(req,res) =>{
    try {
        const { title_id,title, phrase_id, year, image, phrase, time } = req.body;

        const response = await client.index({
            index: 'movies',
            body: {
                title_id,
                title,
                phrase_id,
                year,
                image,
                phrase,
                time
            }
        });

        res.json({ success: true, message: 'Document added successfully', response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add document', error: error.message });
    }
}

const fetchAllDocs = async(req,res)=>{
    try {
        const doc  = await client.search({
            index: 'movies', 
            body: {
                query: {
                    match_all: {} 
                }
            }
        });

        const documents = doc.hits.hits.map(hit => hit._source);
        console.log(documents);
        res.json({ success: true, documents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get documents', error: error.message });
    }
}

const searchQuotes = async(req,res)=>{
    try {
        const { q } = req.query; 

        const body  = await client.search({
            index: 'movies', 
            body: {
                query: {
                    match: {
                        phrase: q 
                    }
                }
            }
        });

        const documents = body.hits.hits.map(hit => hit._source);
        res.json({ success: true, documents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to search documents', error: error.message });
    }
}

router.get('/ping', get);
router.get('/',searchQuotes);
router.post('/create',addDocument);
router.get('/docs',fetchAllDocs);


module.exports = router;