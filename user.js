async function insertUser(name, db) {
    if (!name) {
        return { status: 400, body: 'Bad Request' };
    }
    if (typeof name !== 'string') {
        return { status: 400, body: 'Bad Request'};
    }
    if (name.length > 100) {
        return { status: 400, body: 'over length'};
    }
    await db.collection('user').insertOne({ name: name });
    return { status: 200, body: 'Created' };
}

exports.insertUser = insertUser;

async function getUsers(db) {
    //users配列の中はオブジェクト
    const users = await db.collection('user').find().toArray();//users:データベースからとってきた値(find())をtoArray()
    //map:配列の中の要素を一つずつ取り出して、新しい配列を作る
    const names = users.map((user) => { return user.name });
    return {names};
}
exports.getUsers = getUsers;