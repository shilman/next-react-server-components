import { faker } from '@faker-js/faker'
import { drop, factory, manyOf, primaryKey } from '@mswjs/data'

let _id

export const db = factory({
  item: {
    type: String, // 'post' | 'comment'

    // generic item
    id: primaryKey(() => _id++),
    time: () => faker.date.recent({ days: 2 }).getTime() / 1000,
    user: faker.internet.userName,
    kids: manyOf('item'),
    descendants: Number,

    // post item
    title: faker.lorem.words,
    url: faker.internet.url,
    score: () => faker.number.int(100),

    // comment item
    text: faker.lorem.paragraph
  }
})

export const range = (count: number) =>
  Array.from({ length: count }, (x, i) => i)

export const reset = (seed?: number) => {
  _id = 1
  faker.seed(seed ?? 123)
  return drop(db)
}

interface Item {
  id: number
  time: number
  user: string
  kids: Item[]
  score: number
  descendants: number
}

interface Comment extends Item {
  type: 'comment'
  text: string
}

interface Post extends Item {
  type: 'post'
  title: string
  url: string
}

interface CommentOptions extends Partial<Comment> {
  depth: number
  kidCount?: number
}

export const createComment = ({ depth, kidCount }: CommentOptions) => {
  if (depth === 0) {
    return db.item.create({ type: 'comment', kids: [] })
  }

  const n = kidCount ?? faker.number.int(3)
  const kids = range(n).map(() => createComment({ depth: depth - 1 }))
  return db.item.create({ type: 'comment', kids })
}

interface PostOptions extends Partial<Post> {
  kidCount?: number
}

export const createPost = ({ kidCount, ...rest }: PostOptions = {}) => {
  const start = _id
  const n = kidCount ?? faker.number.int(10)
  const kids = range(n).map(() => createComment({ depth: faker.number.int(3) }))
  const descendants = _id - start - 1

  return db.item.create({ type: 'post', ...rest, kids, descendants })
}

export const postIds = () =>
  db.item.findMany({ where: { type: { equals: 'post' } } }).map((p) => p.id)

export const getItem = (id: number) => {
  const item = db.item.findFirst({ where: { id: { equals: id } } })
  return { ...item, kids: item.kids.map((c) => c.id) }
}
