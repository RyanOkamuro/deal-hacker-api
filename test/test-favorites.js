'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {User} = require('../users/models');
const {Deal} = require('../allDeals/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

let dealsIds;

chai.use(chaiHttp);

function seedDealData() {
    console.info('seeding deal info');
    const seedData = [];

    for (let i=1; i<=4; i++) {
        seedData.push(generateDealData());
    }
    return Deal.insertMany(seedData)
        .then(() => Deal.find())
        .then((deals) => {
            dealsIds = deals.map(deal => deal._id);
            const userData = [];
            for (let i=1; i<=4; i++) {
                userData.push(generateFavoritesData(dealsIds, i));
                (generateAuthToken(i));
            }
            return User.insertMany(userData);
        })
        .catch(err => console.log(err));
}

let randomFavorite = 0;

function generateDealName() {
    const dealName = ['Amazon Fire Stick', 'Dyson DC58/V6 Trigger Cordless Vacuum', 'Apple Watch Series 3 Smartwatch: 42mm', 'Dell XPS 13 128GB SSD 8GB RAM']; 
    randomFavorite = Math.floor(Math.random() * dealName.length);
    return dealName[randomFavorite];
}

function generateProductCategory() {
    const category = ['Electronics', 'Electronics', 'Electronics', 'Electronics'];
    return category[randomFavorite];
}

function generatePrice() {
    const price = [15, 149.99, 309, 999];
    return price[randomFavorite];
}

function generateImage() {
    const image = ['https://images-na.ssl-images-amazon.com/images/I/51D8NXwQfvL._SY355_.jpg', 'https://cdn.shopify.com/s/files/1/2459/7473/products/2_2c700c99-6931-4369-85ae-f7a92ad308d5_1024x1024@2x.JPG?v=1528114460', 'https://slimages.macysassets.com/is/image/MCY/products/4/optimized/9005824_fpx.tif?op_sharpen=1&wid=500&hei=613&fit=fit,1&$filtersm$', 'https://johnlewis.scene7.com/is/image/JohnLewis/237128354?$rsp-pdp-main-1440$'];
    return image[randomFavorite];
}

function generateSeller() {
    const seller = ['Walmart', 'PCMag', 'Macys', 'Dell'];
    return seller[randomFavorite];
}

function generateProductDescription() {
    const productDescription = ['The next generation of our best-selling Fire TV Stick\n 2013now with the Alexa Voice Remote. \n Walmart has the deal on sale for $15 \n Free shipping with purchases $35+', 'Weighing only 3.4lbs this portable vacuum goes anywhere and does any job with its 2 tier radial cyclone suction. Hygienic bin emptying makes it a quick and clean way to dispose of debris. \n PCMag has the deal on sale for $149.99 \n Free shipping', 'Measure your workouts, from running and cycling to new high-intensity interval training. Track and share your daily activity, and get the motivation you need to hit your goals. Better manage everyday stress and monitor your heart rate more effectively. Automatically sync your favorite playlists. And stay connected to the people and info you care about most.', 'The smallest 13.3-inch laptop on the planet has the world\u2019s first virtually borderless InfinityEdge display and the latest Intel® processors. Touch, Silver, and Rose Gold options available.'];
    return productDescription[randomFavorite];
}

function generateDealLink() {
    const dealLink = ['https://www.walmart.com/ip/All-New-F-re-TV-with-4K-Ultra-HD-and-Alexa-Voice-Remote-2017-Edition-Pendant-Streaming-Media-Player/336757733', 'https://shop.pcmag.com/products/dyson-dc58-v6-trigger-cordless-vacuum', 'https://www.macys.com/shop/product/apple-watch-series-3-gps-42mm-space-gray-aluminum-case-with-black-sport-band?ID=5302666&CategoryID=154442#fn=sp%3D1%26spc%3D29%26ruleId%3D78%7CBOOST%20SAVED%20SET%7CBOOST%20ATTRIBUTE%26searchPass%3DmatchNone%26slotId%3D1', 'https://www.dell.com/en-us/shop/dell-laptops/xps-13/spd/xps-13-9360-laptop/fndot5135hv2cl'];
    return dealLink[randomFavorite];
}

function generateComments() {
    const comments = [{
        comment: ['Best reason to disconnect from cable', 'Keeps the house clean all day long', 'Battery lasts about 1 day per charge', 'Best ultrabook around for the price'],
    }];    
    return comments[randomFavorite];
}

function generateUserName(index) {
    if(!index) index = 0;
    const username = ['JohnSmith', 'AprilLane', 'BobSil', 'JaneRed'];
    return username[index-1];
}

function generatePassword() {
    const username = ['JohnSmith12345', 'AprilLane12345', 'BobSil12345', 'JaneRed12345'];
    return username[Math.floor(Math.random() * username.length)];
}

function generateFirstName() {
    const firstName = ['John', 'April', 'Bob', 'Jane'];
    return firstName[Math.floor(Math.random() * firstName.length)];
}

function generateLastName() {
    const lastName = ['Smith', 'Lane', 'Sil', 'Red'];
    return lastName[Math.floor(Math.random() * lastName.length)];
}

function generateFavoritesData(dealsIds, index) {
    return {
        username: generateUserName(index),
        password: generatePassword(),
        firstName: generateFirstName(),
        lastName: generateLastName(),
        favorites: dealsIds
    };  
}  

function generateDealData() {
    return {
        'dealName': generateDealName(),
        'productCategory': generateProductCategory(),
        'price': generatePrice(),
        'image': generateImage(),
        'seller': generateSeller(),
        'productDescription': generateProductDescription(),
        'dealLink': generateDealLink(),
        'comments': generateComments()
    };
}

function generateAuthToken(username, firstName, lastName, id){
    let authToken = jwt.sign(
        {
            user: {
                id: id,
                username: username || generateUserName(),
                firstName: firstName || generateFirstName(),
                lastName: lastName || generateLastName()
            }
        },
        JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '7d'
        }
    );
    return {
        authToken
    };
}

function tearDownDb() {
    console.warn('Delete database');
    return mongoose.connection.dropDatabase();
}

describe('Favorite deals API resource', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedDealData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET Favorite Deal Information', function() {
        it('should list favorite deal information on GET', function() {
            let res; 
            let _user;
            return User                
                .findOne()
                .then(function(user) {
                    _user = user;
                    const auth = generateAuthToken(user.username, user.firstName, user.lastName, user._id);
                    return chai
                        .request(app)
                        .get('/favorites')
                        .set('Authorization', `Bearer ${auth.authToken}`)
                        .then(function(_res) {
                            res = _res;
                            expect(res).to.have.status(200);
                            expect(res.body.favorites).to.be.a('array');
                        });
                });
        });

        it('should return the correct fields for favorite deal', function() {
            let resFavorite;
            let _user;
            return User                
                .findOne()
                .then(function(user) {
                    _user = user;
                    const auth = generateAuthToken(user.username, user.firstName, user.lastName, user._id);
                    return chai
                        .request(app)
                        .get('/favorites')
                        .set('Authorization', `Bearer ${auth.authToken}`)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body.favorites).to.be.a('array');
                            expect(res.body.favorites).to.have.lengthOf.at.least(1);
                            const expectedKeys = ['dealName', 'productCategory', 'price', 'image', 'seller', 'productDescription', 'dealLink', 'comments'];
                            res.body.favorites.forEach(function(saleItem) {
                                expect(saleItem).to.be.a('object');
                                expect(saleItem).to.include.keys(expectedKeys);
                            });
                            resFavorite = res.body.favorites[0];
                            return resFavorite;   
                        })
                        .then(function(saleItem) {
                            expect(resFavorite._id).to.equal(saleItem._id);
                            expect(resFavorite.dealName).to.equal(saleItem.dealName);
                            expect(resFavorite.productCategory).to.equal(saleItem.productCategory);
                            expect(resFavorite.price).to.equal(saleItem.price);
                            expect(resFavorite.image).to.equal(saleItem.image);
                            expect(resFavorite.seller).to.equal(saleItem.seller);
                            expect(resFavorite.productDescription).to.equal(saleItem.productDescription);
                            expect(resFavorite.dealLink).to.equal(saleItem.dealLink);
                            expect(resFavorite.comments).to.equal(saleItem.comments);
                        });
                });
        });
    });

    describe('POST Favorite Deal Information', function() {
        it('should add a new deal to favorites on POST', function() {
            let resfavoriteItem;
            let _user;
            let _deal;
            let auth;
            return Deal
                .create(generateDealData())
                .then(deal => {
                    _deal = deal;
                    return User                
                        .findOne()
                        .then(function(user) {
                            _user = user;
                            return auth = generateAuthToken(user.username, user.firstName, user.lastName, user._id);
                        })
                        .then(auth => {
                            return chai
                                .request(app)
                                .post('/favorites')
                                .set('Authorization', `Bearer ${auth.authToken}`)
                                .send({id: _deal._id})
                                .then(function(res) {
                                    expect(res).to.have.status(201);
                                    expect(res).to.be.json;
                                    resfavoriteItem = res.body.favorites[res.body.favorites.length-1];
                                    return resfavoriteItem; 
                                })
                                .then(function(resfavoriteItem) {
                                    expect(resfavoriteItem._id).to.equal(_deal._id.toString());
                                });
                        });
                });
        });
    });


    describe('DELETE Favorite', function() {
        it('delete favorite deal from favorites by id', function() {
            let _user;
            let _favoriteId;
            return User                
                .findOne()
                .then(function(user) {
                    _user = user;
                    _favoriteId = user.favorites[0];
                    const auth = generateAuthToken(user.username, user.firstName, user.lastName);
                    return chai.request(app)
                        .delete(`/favorites/${_favoriteId}`)
                        .set('Authorization', `Bearer ${auth.authToken}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return User.findOne({_id: _user._id, favorites: _favoriteId});
                })
                .then(function(user) {
                    expect(user).to.be.null;
                });
        }); 
    });
});