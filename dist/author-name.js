"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_author_1 = __importDefault(require("parse-author"));
function getNameFromAuthor(author) {
    let publisher = author || '';
    if (typeof publisher === 'string') {
        publisher = parse_author_1.default(publisher);
    }
    if (typeof publisher !== 'string' && publisher && typeof publisher.name === 'string') {
        publisher = publisher.name;
    }
    if (typeof publisher !== 'string') {
        publisher = '';
    }
    return publisher;
}
exports.default = getNameFromAuthor;
//# sourceMappingURL=author-name.js.map