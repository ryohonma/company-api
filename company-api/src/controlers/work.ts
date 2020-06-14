import express from 'express';

const router = express.Router();

router.get('/', async (req:express.Request, res:express.Response) => { 
  // ここでpuppeterrのgetを呼び出す
    return res.status(200).json({result:0});
});

router.post('/', async (req:express.Request, res:express.Response) => { 
  // ここでpuppeterrのpostを呼び出す
    return res.status(200).json({result:0});
});

export default router;
