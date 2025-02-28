import swaggerUi from 'swagger-ui-express'
import postmanToOpenApi from 'postman-to-openapi'
// import swaggerJson from './openapi.json' assert { type: 'json' }
const swaggerJson = await import('./openapi.json', { assert: { type: 'json' } })

const generateYML = async (req, res, next) => {
    const postmanCollection = './src/docs/collection.json'
    const outputFile = './src/docs/openapi.yml'
    try {
        const result = await postmanToOpenApi(postmanCollection, outputFile, {
            defaultTag: 'General',
        })
        res.status(200).send(result)
    } catch (err) {
        next(err)
    }
}

export { swaggerUi, swaggerJson, generateYML }
