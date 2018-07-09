'use strict';

require('dotenv').config();
const chai = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {User} = require('../users/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);

let authToken;
let agent = request.agent(app);

function seedDealData() {
    console.info('seeding deal info');
    const seedData = [];

    for (let i=1; i<=4; i++) {
        seedData.push(generateDealData());
    }
    return User.insertMany(seedData);
}

let randomDeal = 0;

function generateDealName() {
    const dealName = ['Amazon Fire Stick', 'Dyson DC58/V6 Trigger Cordless Vacuum', 'Apple Watch Series 3 Smartwatch: 42mm', 'Dell XPS 13 128GB SSD 8GB RAM'] 
    randomDeal = Math.floor(Math.random() * dealName.length)
    return dealName[randomDeal];
}

function generateProductCategory() {
    const category = ['Electronics', 'Electronics', 'Electronics', 'Electronics']
    return category[randomDeal];
}

function generatePrice() {
    const price = [15, 149.99, 309, 999]
    return price[randomDeal];
}

function generateImage() {
    const image = ['https://images-na.ssl-images-amazon.com/images/I/51D8NXwQfvL._SY355_.jpg', 'https://cdn.shopify.com/s/files/1/2459/7473/products/2_2c700c99-6931-4369-85ae-f7a92ad308d5_1024x1024@2x.JPG?v=1528114460', 'https://slimages.macysassets.com/is/image/MCY/products/4/optimized/9005824_fpx.tif?op_sharpen=1&wid=500&hei=613&fit=fit,1&$filtersm$', 'https://johnlewis.scene7.com/is/image/JohnLewis/237128354?$rsp-pdp-main-1440$']
    return image[randomDeal];
}

function generateSeller() {
    const seller = ['Walmart', 'PCMag', 'Macys', 'Dell']
    return seller[randomDeal];
}

function generateProductDescription() {
    const productDescription = ['The next generation of our best-selling Fire TV Stick\n 2013now with the Alexa Voice Remote. \n Walmart has the deal on sale for $15 \n Free shipping with purchases $35+', 'Weighing only 3.4lbs this portable vacuum goes anywhere and does any job with its 2 tier radial cyclone suction. Hygienic bin emptying makes it a quick and clean way to dispose of debris. \n PCMag has the deal on sale for $149.99 \n Free shipping', 'Measure your workouts, from running and cycling to new high-intensity interval training. Track and share your daily activity, and get the motivation you need to hit your goals. Better manage everyday stress and monitor your heart rate more effectively. Automatically sync your favorite playlists. And stay connected to the people and info you care about most.', 'The smallest 13.3-inch laptop on the planet has the world\u2019s first virtually borderless InfinityEdge display and the latest Intel® processors. Touch, Silver, and Rose Gold options available.']
    return productDescription[randomDeal];
}

function generateDealLink() {
    const dealLink = ['https://www.walmart.com/ip/All-New-F-re-TV-with-4K-Ultra-HD-and-Alexa-Voice-Remote-2017-Edition-Pendant-Streaming-Media-Player/336757733', 'https://shop.pcmag.com/products/dyson-dc58-v6-trigger-cordless-vacuum', 'https://www.macys.com/shop/product/apple-watch-series-3-gps-42mm-space-gray-aluminum-case-with-black-sport-band?ID=5302666&CategoryID=154442#fn=sp%3D1%26spc%3D29%26ruleId%3D78%7CBOOST%20SAVED%20SET%7CBOOST%20ATTRIBUTE%26searchPass%3DmatchNone%26slotId%3D1', 'https://www.dell.com/en-us/shop/dell-laptops/xps-13/spd/xps-13-9360-laptop/fndot5135hv2cl']
    return dealLink[randomDeal];
}

function generateComments() {
    const comments = [{
        comment: ['Best reason to disconnect from cable', 'Keeps the house clean all day long', 'Battery lasts about 1 day per charge', 'Best ultrabook around for the price'],
    }]
    return comments[randomDeal];
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

function tearDownDb() {
    console.warn('Delete database');
    return mongoose.connection.dropDatabase();
}

    describe('Deal API resource', function() {

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

    describe('GET Deal Name Information', function() {
        it('should list deal information on GET', function() {
            let res; 
            agent 
                .get('/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body.deal).to.have.lengthOf.at.least(1);
                    return User.count();
                })
                .then(function(count) {
                    expect(res.body.deal).to.have.lengthOf(count);
                });
        });

        it('should return the correct fields for deal', function() {
            let resDeal;
            agent
                .get('/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.deal).to.be.a('array');
                    expect(res.body.deal).to.have.lengthOf.at.least(1);
                    const expectedKeys = ['dealName', 'productCategory', 'price', 'image', 'seller', 'productDescription', 'dealLink', 'comments']
                    res.body.deal.forEach(function(saleItem) {
                        expect(saleItem).to.be.a('object');
                        expect(saleItem).to.include.keys(expectedKeys);
                    });
                    resDeal = res.body.deal[0];
                    return User.findById(resDeal.id);
                })
                .then(function(saleItem) {
                    expect(resDeal.id).to.equal(saleItem.id);
                    expect(resDeal.dealName).to.equal(saleItem.dealName);
                    expect(resDeal.productCategory).to.equal(saleItem.productCategory);
                    expect(resDeal.price).to.equal(saleItem.price);
                    expect(resDeal.image).to.equal(saleItem.image);
                    expect(resDeal.seller).to.equal(saleItem.seller);
                    expect(resDeal.productDescription).to.equal(saleItem.productDescription);
                    expect(resDeal.dealLink).to.equal(saleItem.dealLink);
                    expect(resDeal.comments).to.equal(saleItem.comments);
                })
        });
    });

    describe('POST Deal Information', function() {
        it('should add a deal on POST', function() {
            const newFavorite = generateDealData();
            agent
                .set('Authorization', `Bearer ${authToken}`)
                .post('/favorites')
                .send(newFavorite)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('dealName', 'productCategory', 'price', 'image', 'seller', 'productDescription', 'dealLink', 'comments')
                    expect(res.body.dealName).to.equal(newFavorite.dealName);
                    expect(res.body.productCategory).to.equal(newFavorite.productCategory);
                    expect(res.body.price).to.equal(newFavorite.price);
                    expect(res.body.image).to.equal(newFavorite.image);
                    expect(res.body.seller).to.equal(newFavorite.seller);
                    expect(res.body.productDescription).to.equal(newFavorite.productDescription);
                    expect(res.body.dealLink).to.equal(newFavorite.dealLink);
                    expect(res.body.comments).to.equal(newFavorite.comments);
                    expect(res.body.id).to.not.be.null;
                    return User.findById(res.body.id);
                })
                .then(function(saleItem) {
                    expect(saleItem.dealName).to.equal(newFavorite.dealName);
                    expect(saleItem.productCategory).to.equal(newFavorite.productCategory);
                    expect(saleItem.price).to.equal(newFavorite.price);
                    expect(saleItem.image).to.equal(newFavorite.image);
                    expect(saleItem.seller).to.equal(newFavorite.seller);
                    expect(saleItem.productDescription).to.equal(newFavorite.productDescription);
                    expect(saleItem.dealLink).to.equal(newFavorite.dealLink);
                    expect(saleItem.comments).to.equal(newFavorite.comments);
                });
        });
    });


    describe('DELETE Deal Information', function() {
        it('delete deal by id', function() {
          let deal;
          agent
            .set('Authorization', `Bearer ${authToken}`)
          User
            .findOne()
            .then(function(_deal) {
              deal = _deal;
              return chai.request(app).delete(`/favorites/${deal.id}`);
            })
            .then(function(res) {
             expect(res).to.have.status(204);
              return User.findById(deal.id);
            })
            .then(function(_deal) {
              expect(_deal).to.be.null;
            });
        }); 
    });
});