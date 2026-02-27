const { test } = require('node:test');
const assert = require('node:assert');

const { insertUser, getUsers } = require('./user');

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

test('getUsers', async (t) =>{
    const db = {
        collection: () => {
            return {
                find: () => {
                    return {
                        toArray: () => {
                            return [
                                { name: 'aaaa' },
                                { name: 'bbbb' },
                                { name: 'cccc' }
                            ];
                        }
                    }
                }
            }
        }
    };
    const { names } = await getUsers(db);
    assert.deepEqual(names.length, 3, 'データベースから3件のデータを取り出して返却する');
    assert.deepEqual(names[0],'aaaa', '配列の0番目が名前の文字列になっていること')
});

test('getUsers: error', async (t) => {
    const toArray = t.mock.fn(() => {
      throw new Error('something error');
    });
    const db = {
        collection: () => {
          return {
             find: () => {
               return { toArray };
             }
           };
        },
      };
    

    // assertの数をカウントする
    t.plan(1);
    try {
        await getUsers(db);
        // 絶対に失敗するassertを書く方法もある
        assert(true, false);
      } catch (e) {
        // テスト内でassertの回数がカウントできるようにする
        t.assert.strictEqual(e.message, 'something error');
      }
    
});