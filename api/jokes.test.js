const request=require('supertest')
const db=require('./../data/dbConfig')
const server=require('./server')
const Joke=require('./jokesModel')

const joke1 = { joke: "Why did the chicken cross the road", punchline: "Because it was free range" }
const joke2 = { joke: "Why did the chicken cross the road", punchline: "To avoid this lame and outdated joke" }

beforeAll(async ()=>{
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async ()=>{
    await db('jokes').truncate()
})
//销毁数据库连接，以释放资源并确保不会在测试运行后继续保持数据库连接。
afterAll(async()=>{
    await db.destroy()
})


test("environment is Testing",()=>{
    expect(process.env.NODE_ENV).toBe("testing")
})

describe("Jokes model functions",()=>{
    describe("create joke",()=>{
        test("add joke to the db",async()=>{
            let jokes
            await Joke.createJoke(joke1)
            jokes=await db('jokes')
            expect(jokes).toHaveLength(1)
        })
        test("inserted joke and punchline", async () => {
            let jokes=await Joke.createJoke(joke1)
            expect(jokes).toMatchObject({joke_id:1,...jokes})
        })
    })
    describe("[DELETE]/-deletes joke", () => {
        test("removes joke from db", async () => {
            const [joke_id]=await db('jokes').insert(joke1)
            let joke=await db('jokes').where({joke_id}).first()
            expect(joke).toBeTruthy()
            await request(server).delete('/jokes/'+joke_id)
            joke = await db('jokes').where({ joke_id }).first()
            expect(joke).toBeFalsy()
        })
        test("respond with the deleted joke", async () => {
             await db('jokes').insert(joke1)
            let joke = await request(server).delete('/jokes/1')
            expect(joke.body).toMatchObject(joke1)
        })
        
    })
    
})