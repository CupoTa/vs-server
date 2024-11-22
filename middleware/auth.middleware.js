const crypto = require('crypto');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
       return next()
    }

    try {
        const token = req?.body?.queryString

        if (!token) {
            return res.status(401).json({message: 'Error not Telegram data'})
        }
        const data = Object.fromEntries(new URLSearchParams(token));
        
        // Извлечение и удаление хеша из объекта данных
        const { hash } = data;
        delete data.hash;
        // Формирование строки для проверки, сортируя ключи в алфавитном порядке
        const dataCheckString = Object.keys(data)
          .sort()
          .map(key => `${key}=${decodeURIComponent(data[key])}`)
          .join('\n');
        
        // Генерация секретного ключа
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
          .update(process.env.BOT_TOKEN)
          .digest();
        
        // Вычисление сигнатуры для проверки
        const hmac = crypto.createHmac('sha256', secretKey)
          .update(dataCheckString)
          .digest('hex');
        // Сравнение вычисленной сигнатуры с полученным хешем
        if(hmac !== hash){
            return res.status(401).json({message: 'Error validate Telegram data'})
        }

        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}