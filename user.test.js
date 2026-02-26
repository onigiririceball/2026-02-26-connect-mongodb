const { test } = require('node:test');
const assert = require('node:assert');

const { insertUser } = require('./user');

test('insertUser', async (t) => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    },
  };
  const { status, body } = await insertUser('test', db)
  assert.strictEqual(status, 200, '正しくデータが挿入された場合、ステータスコード200を返す');
  assert.strictEqual(body, 'Created', '正しくデータが挿入された場合、Createdを返す');
  assert.strictEqual(insertOne.mock.callCount(), 1, '1度だけinsertOneが呼ばれる');
  
});