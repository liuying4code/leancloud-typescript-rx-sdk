"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RxLeanCloud_1 = require("../RxLeanCloud");
const SDKPlugins_1 = require("../internal/SDKPlugins");
/**
 * 针对 RxAVObject 的查询构建类
 *
 * @export
 * @class RxAVQuery
 */
class RxAVQuery {
    constructor(objectClass) {
        if (typeof objectClass === 'string') {
            this.className = objectClass;
        }
        else if (objectClass instanceof RxLeanCloud_1.RxAVObject) {
            this.className = objectClass.className;
        }
        else {
            throw new Error('A RxAVQuery must be constructed with a RxAVObject or class name.');
        }
        this._where = {};
        this._include = [];
        this._limit = -1; // negative limit is not sent in the server request
        this._skip = 0;
        this._extraOptions = {};
    }
    static get _encoder() {
        return SDKPlugins_1.SDKPlugins.instance.Encoder;
    }
    static get _queryController() {
        return SDKPlugins_1.SDKPlugins.instance.QueryControllerInstance;
    }
    config(filter, limit, skip, include, select) {
        return new RxAVQuery(this.className);
    }
    equalTo(key, value) {
        this._where[key] = this._encode(value, false, true);
        return this;
    }
    notEqualTo(key, value) {
        return this._addCondition(key, '$ne', value);
    }
    lessThan(key, value) {
        return this._addCondition(key, '$lt', value);
    }
    lessThanOrEqualTo(key, value) {
        return this._addCondition(key, '$lte', value);
    }
    greaterThan(key, value) {
        return this._addCondition(key, '$gt', value);
    }
    greaterThanOrEqualTo(key, value) {
        return this._addCondition(key, '$gte', value);
    }
    containedIn(key, value) {
        return this._addCondition(key, '$in', value);
    }
    notContainedIn(key, value) {
        return this._addCondition(key, '$nin', value);
    }
    containsAll(key, values) {
        return this._addCondition(key, '$all', values);
    }
    exists(key) {
        return this._addCondition(key, '$exists', true);
    }
    doesNotExist(key) {
        return this._addCondition(key, '$exists', false);
    }
    contains(key, value) {
        if (typeof value !== 'string') {
            throw new Error('The value being searched for must be a string.');
        }
        return this._addCondition(key, '$regex', this.quote(value));
    }
    startsWith(key, value) {
        if (typeof value !== 'string') {
            throw new Error('The value being searched for must be a string.');
        }
        return this._addCondition(key, '$regex', '^' + this.quote(value));
    }
    endsWith(key, value) {
        if (typeof value !== 'string') {
            throw new Error('The value being searched for must be a string.');
        }
        return this._addCondition(key, '$regex', this.quote(value) + '$');
    }
    quote(s) {
        return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
    }
    relatedTo(parent, key) {
        this._addCondition('$relatedTo', 'object', {
            __type: 'Pointer',
            className: parent.className,
            objectId: parent.objectId
        });
        return this._addCondition('$relatedTo', 'key', key);
    }
    ascending(...keys) {
        this._order = [];
        return this.addAscending.apply(this, keys);
    }
    addAscending(...keys) {
        if (!this._order) {
            this._order = [];
        }
        keys.forEach((key) => {
            if (Array.isArray(key)) {
                key = key.join();
            }
            this._order = this._order.concat(key.replace(/\s/g, '').split(','));
        });
        return this;
    }
    descending(...keys) {
        this._order = [];
        return this.addDescending.apply(this, keys);
    }
    addDescending(...keys) {
        if (!this._order) {
            this._order = [];
        }
        keys.forEach((key) => {
            if (Array.isArray(key)) {
                key = key.join();
            }
            this._order = this._order.concat(key.replace(/\s/g, '').split(',').map((k) => {
                return '-' + k;
            }));
        });
        return this;
    }
    skip(n) {
        if (typeof n !== 'number' || n < 0) {
            throw new Error('You can only skip by a positive number');
        }
        this._skip = n;
        return this;
    }
    limit(n) {
        if (typeof n !== 'number') {
            throw new Error('You can only set the limit to a numeric value');
        }
        this._limit = n;
        return this;
    }
    include(...keys) {
        keys.forEach((key) => {
            if (Array.isArray(key)) {
                this._include = this._include.concat(key);
            }
            else {
                this._include.push(key);
            }
        });
        return this;
    }
    select(...keys) {
        if (!this._select) {
            this._select = [];
        }
        keys.forEach((key) => {
            if (Array.isArray(key)) {
                this._select = this._select.concat(key);
            }
            else {
                this._select.push(key);
            }
        });
        return this;
    }
    /**
     * 执行查询
     *
     * @returns {Observable<Array<RxAVObject>>}
     *
     * @memberOf RxAVQuery
     */
    find() {
        return RxAVQuery._queryController.find(this, RxLeanCloud_1.RxAVUser.currentSessionToken).map(serverStates => {
            let resultList = serverStates.map((serverState, i, a) => {
                let rxObject = new RxLeanCloud_1.RxAVObject(this.className);
                rxObject.handleFetchResult(serverState);
                return rxObject;
            });
            if (resultList == undefined || resultList == null) {
                resultList = [];
            }
            return resultList;
        });
    }
    /**
     *
     *
     * @static
     * @param {...Array<RxAVQuery>} queries
     * @returns {RxAVQuery}
     *
     * @memberOf RxAVQuery
     */
    static or(...queries) {
        let className = null;
        queries.forEach((q) => {
            if (!className) {
                className = q.className;
            }
            if (className !== q.className) {
                throw new Error('All queries must be for the same class.');
            }
        });
        let query = new RxAVQuery(className);
        query._orQuery(queries);
        return query;
    }
    _orQuery(queries) {
        let queryJSON = queries.map((q) => {
            return q._where;
        });
        this._where.$or = queryJSON;
        return this;
    }
    _addCondition(key, condition, value) {
        if (!this._where[key] || typeof this._where[key] === 'string') {
            this._where[key] = {};
        }
        this._where[key][condition] = this._encode(value, false, true);
        return this;
    }
    _encode(value, disallowObjects, forcePointers) {
        return RxAVQuery._encoder.encodeItem(value);
    }
    buildParameters(includeClassName = false) {
        let result = {};
        if (Object.keys(this._where).length > 0) {
            result['where'] = JSON.stringify(this._where);
        }
        if (this._order) {
            result["order"] = this._order.join(",");
        }
        if (this._limit > 0) {
            result["limit"] = this._limit;
        }
        if (this._skip > 0) {
            result["skip"] = this._skip;
        }
        if (this._include.length) {
            result['include'] = this._include.join(',');
        }
        if (this._select) {
            result['keys'] = this._select.join(',');
        }
        return result;
    }
}
exports.RxAVQuery = RxAVQuery;
