import { supabase } from '../../utils/supabaseClient.js';
import cookie from 'cookie';

async function handler(req, res) {
    if (req.method === 'POST') {
        const userid = cookie.parse(req.headers.cookie).user

        const notebcount = await supabase.from('noteboxes').select('*').eq('user', userid);
        const id = notebcount.body[0] ? notebcount.body[notebcount.body.length - 1].id + 1 : 1;

        const note = await supabase.from('noteboxes').insert({
            content: req.body.content,
            user: userid,
            id: id,
            note: req.body.note,
        });

        res.status(200).json({
            user: userid,
            id: note.data[0].id
        });
    } else {
        const noteboxes = await supabase.from('noteboxes').select('*').eq('user', cookie.parse(req.headers.cookie).user).eq('note', req.headers.note);
        res.status(200).json(noteboxes.body);
    }
}

export default handler;