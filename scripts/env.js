import * as fs from 'fs';

if (!fs.existsSync('.env')) {
    fs.cpSync('.env.example', '.env');
}
