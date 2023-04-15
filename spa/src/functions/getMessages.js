import axios from 'axios';
import config from '../config';

export default async function getMessages() {
    try {
        let res = await axios.get(`${config.url}getMessages.php`);
        return res.data;
    }
    catch (err) {
        return false
    }
}