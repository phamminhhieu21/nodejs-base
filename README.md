module.exports = {
up: function (queryInterface, Sequelize) {
// logic for transforming into the new state
return queryInterface.addColumn(
'Users',
'refresh_token',
Sequelize.STRING
);

},

down: function (queryInterface, Sequelize) {
// logic for reverting the changes
return queryInterface.removeColumn(
'Users',
'refresh_token'
);
}
}

//PORT=8080
JWT_SECRET=BA9245D2786E48A7888DBD89A1CFE4C7
JWT_REFRESH_SECRET=BA9245D2786E48A7888DBD89A1CFE4C7
CLOUDINARY_NAME=hieupmcloud
CLOUDINARY_KEY=135348266929968
CLOUDINARY_SECRET=ICFJejTfT97ysTYoSlAyNRtesOM
LIMIT=8

```
DB_HOST=mysql-node-db-test.alwaysdata.net
DB_USER=316579_admin
DB_PASSWORD=@Hieupm2k03
DB_NAME=node-db-test_base
DB_PORT=''
```
