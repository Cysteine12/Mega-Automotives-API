import { createLogger, format, transports, config } from 'winston'
import 'winston-mongodb'
import SlackHook from 'winston-slack-webhook-transport'

let formatType = null
let transportsList = []

if (process.env.NODE_ENV !== 'production') {
    formatType = format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })

    transportsList.push(new transports.Console())
} else {
    formatType = format.json()

    transportsList.push(
        new transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: 'server_logs',
            level: 'error',
        }),
        new SlackHook({
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            level: 'error',
            formatter: ({ timestamp, level, message }) => {
                return {
                    text: `*${level.toUpperCase()}* - ${message}\n_Time:_ ${timestamp}`,
                }
            },
        })
    )
}

const logger = createLogger({
    level: config.syslog.levels,
    format: format.combine(format.timestamp(), formatType),
    transports: transportsList,
})

export default logger

// const logger = (req, res, next) => {
//     console.log(
//         `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     )
//     next()
// }
