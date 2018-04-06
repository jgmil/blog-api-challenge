const chai = require('chai');
const chaiHttp = require('chai-http');

const {
    app,
    runServer,
    closeServer
} = require('../server');

chai.use(chaiHttp);

describe('Blog Post', function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it('should list items on GET', function () {
        return chai.request(app)
            .get('/blog-post')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['title', 'content', 'author'];
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add a blog post on POST', function () {
        const newItem = {
            title: 'New Post',
            content: 'some really great content',
            author: 'Maya Angelou'
        };
        return chai.request(app)
            .post('/shopping-list')
            .send(newItem)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'name', 'checked');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newItem, {
                    id: res.body.id
                }));
            });
    });

    it('should update a post on PUT', function () {
        const updateData = {
            title: 'New Post',
            content: 'some really great content',
            author: 'Maya Angelou'
        };

        return chai.request(app)
            // first have to get so we have an idea of object to update
            .get('/blog-posts')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.deep.equal(updateData);
            });
    });

    it('should delete a post on DELETE', function () {
        return chai.request(app)
            // first have to get so we have an `id` of item
            // to delete
            .get('/blog-posts')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            });
    });
});
