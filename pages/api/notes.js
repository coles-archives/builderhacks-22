import { supabase } from '../../utils/supabaseClient.js';
import cookie from 'cookie';
import humanid from 'human-id';
import Cookies from 'cookies';

async function handler(req, res) {
    if (req.method === 'POST') {
        const userid = req.headers.cookie ? cookie.parse(req.headers.cookie).user : humanid({
            capitalize: false,
            separator: '-',
        });

        const notecount = await supabase.from('notes').select('*').eq('user', userid);
        const id = notecount.body[0] ? notecount.body[notecount.body.length - 1].id + 1 : 1;

        const note = await supabase.from('notes').insert({
            title: req.body.title,
            user: userid,
            id: id,
            lastedit: new Date().toISOString(),
        });

        const cookies = new Cookies(req, res)
        cookies.set('user', userid, {
            httpOnly: false
        });

        res.status(200).json({
            user: userid,
            id: note.data[0].id
        });
    } else {
        const notes = await supabase.from('notes').select('*').eq('user', cookie.parse(req.headers.cookie).user);
        res.status(200).json(notes.body);
    }
}

export default handler;