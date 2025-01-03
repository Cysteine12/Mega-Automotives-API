import { connect } from 'mongoose'

const db = {
    connect: async () => {
        try {
            const uri = process.env.MONGO_URI

            await connect(uri, {
                autoIndex: process.env.NODE_ENV !== 'production',
            })
            console.log('MongoDB connected')
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    },
}

export default db
