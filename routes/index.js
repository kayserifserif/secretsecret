var express = require('express');
var router = express.Router();
import { createClient } from '@supabase/supabase-js'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Create a single supabase client for interacting with your database 
const supabase = createClient('https://dxtyotcvyaxxltnjainb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjUwMzA2MiwiZXhwIjoxOTUyMDc5MDYyfQ.kuK0bnFKkRd3e6gZWuV3Khf-2L0s64Z-hbSAjMTmx9I')

module.exports = router;
