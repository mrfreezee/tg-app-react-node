const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '6892294807:AAHsdLVy4Meleu9IcClU54fVJ357pfxk0Tc';
const webAppUrl = 'https://lovely-medovik-811c56.netlify.app'


const bot = new TelegramBot(token, { polling: true });
const app = express()

app.use(express.json())
app.use(cors())


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    if(text === '/start'){
        await bot.sendMessage(chatId, 'Ниже будет кнопка заполнения формы',{
            reply_markup:{
                keyboard:[
                    [{text: 'Заполните форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        }
        )
    }
    if(text === '/start'){
        await bot.sendMessage(chatId, 'Ниже будет кнопка заполнения формы',{
            reply_markup:{
                inline_keyboard:[
                    [{text: 'Заполните форму2', web_app: {url: webAppUrl}}]
                ]
            }
        }
        )
    }
    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна:' + data?.country)
            await bot.sendMessage(chatId, 'Ваш город:' + data?.city)
            await bot.sendMessage(chatId, 'Ваша улица:' + data?.street)

            setTimeout(async()=>{
                await bot.sendMessage(chatId, 'Всю информацию вы можете получить в этом чате')
            }, 3000)
        } catch(e){
            console.log(e)
        }
    }
});

app.post('/web-data',  async(req, res) =>{
    const {queryId, products, totalPrice} = req.body

    try{
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешня покупка',
            input_message_content: {message_text: 'Поздравляем, вы приобрели товар на сумму' + totalPrice}
        })
        return res.status(200).json({})
    } catch(e){
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось совершить покупку',
            input_message_content: {message_text: 'Не удалось совершить покупку'}
        })
        return res.status(500).json({})
    }
})

const PORT = 3002

app.listen(PORT, () => console.log('server  on PORT' + PORT))