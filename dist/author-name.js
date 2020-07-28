var parse_author_1 = require('parse-author');
function getNameFromAuthor(author) {
    var publisher = author || '';
    if (typeof publisher === 'string') {
        publisher = parse_author_1["default"](publisher);
    }
    if (typeof publisher !== 'string' && publisher && typeof publisher.name === 'string') {
        publisher = publisher.name;
    }
    if (typeof publisher !== 'string') {
        publisher = '';
    }
    return publisher;
}
exports["default"] = getNameFromAuthor;
